package com.oceanview.servlet;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import com.google.gson.Gson;
import com.oceanview.dao.ReservationDAO;
import com.oceanview.dao.RoomDAO;
import com.oceanview.model.Reservation;
import com.oceanview.model.Room;
import com.oceanview.util.ApiResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/reservations/*")
public class ReservationServlet extends HttpServlet {

    private final ReservationDAO reservationDAO = new ReservationDAO();
    private final RoomDAO roomDAO = new RoomDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Gson gson = com.oceanview.util.GsonUtil.getGson();

        String pathInfo = req.getPathInfo();
        if (pathInfo != null && !pathInfo.equals("/")) {
            try {
                int id = Integer.parseInt(pathInfo.substring(1));
                Optional<Reservation> reservationOpt = reservationDAO.findById(id);
                if (reservationOpt.isPresent()) {
                    resp.getWriter().write(gson.toJson(ApiResponse.success("Reservation details", reservationOpt.get())));
                } else {
                    resp.setStatus(404);
                    resp.getWriter().write(gson.toJson(ApiResponse.error("Reservation not found")));
                }
                return;
            } catch (NumberFormatException e) {
                resp.setStatus(400);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid Reservation ID")));
                return;
            }
        }

        List<Reservation> reservations = reservationDAO.findAll();
        resp.getWriter().write(gson.toJson(ApiResponse.success("Reservations fetched", reservations)));
    }

    private void processReservation(Reservation reservation, HttpServletResponse resp, boolean isUpdate) throws IOException {
        Gson gson = com.oceanview.util.GsonUtil.getGson();

        if (reservation == null) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid Request Body")));
            return;
        }

        // Validate dates
        if (reservation.getCheckIn() == null || reservation.getCheckOut() == null) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Check-in and check-out dates are required")));
            return;
        }

        if (reservation.getCheckIn().isAfter(reservation.getCheckOut())) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Check-out date must be after check-in date")));
            return;
        }

        // Check availability
        int excludeId = isUpdate ? reservation.getId() : -1;
        if (!reservationDAO.isRoomAvailable(reservation.getRoomId(), reservation.getCheckIn(), reservation.getCheckOut(), excludeId)) {
            resp.setStatus(409); // Conflict
            resp.getWriter().write(gson.toJson(ApiResponse.error("Room not available for selected dates")));
            return;
        }

        // Calculate details
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        if (nights < 1) {
            nights = 1;
        }
        reservation.setTotalNights((int) nights);

        // Get Room price
        List<Room> rooms = roomDAO.findAllRooms();
        Optional<Room> roomOpt = rooms.stream().filter(r -> r.getId() == reservation.getRoomId()).findFirst();

        if (roomOpt.isEmpty()) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid Room ID")));
            return;
        }

        BigDecimal price = roomOpt.get().getPricePerNight();
        BigDecimal total = price.multiply(BigDecimal.valueOf(nights));
        BigDecimal tax = total.multiply(BigDecimal.valueOf(0.10));
        reservation.setTotalAmount(total.add(tax));

        if (!isUpdate) {
            reservation.setStatus(Reservation.Status.PENDING);
            int id = reservationDAO.createReservation(reservation);
            if (id > 0) {
                reservation.setId(id);
                resp.setStatus(201);
                resp.getWriter().write(gson.toJson(ApiResponse.success("Reservation created", reservation)));
            } else {
                resp.setStatus(500);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Failed to create reservation")));
            }
        } else {
            // Keep existing status if not provided
            if (reservation.getStatus() == null) {
                Optional<Reservation> existing = reservationDAO.findById(reservation.getId());
                existing.ifPresent(value -> reservation.setStatus(value.getStatus()));
            }
            if (reservation.getStatus() == null) {
                reservation.setStatus(Reservation.Status.PENDING);
            }

            if (reservationDAO.updateReservation(reservation)) {
                resp.getWriter().write(gson.toJson(ApiResponse.success("Reservation updated", reservation)));
            } else {
                resp.setStatus(500);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Failed to update reservation")));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Gson gson = com.oceanview.util.GsonUtil.getGson();

        try {
            Reservation reservation = gson.fromJson(req.getReader(), Reservation.class);
            processReservation(reservation, resp, false);
        } catch (com.google.gson.JsonSyntaxException | java.io.IOException e) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid JSON format or data: " + e.getMessage())));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Gson gson = com.oceanview.util.GsonUtil.getGson();

        try {
            Reservation reservation = gson.fromJson(req.getReader(), Reservation.class);

            // Check if ID is in path
            String pathInfo = req.getPathInfo();
            if (pathInfo != null && !pathInfo.equals("/")) {
                try {
                    int id = Integer.parseInt(pathInfo.substring(1));
                    if (reservation != null) {
                        reservation.setId(id);
                    }
                } catch (NumberFormatException e) {
                    resp.setStatus(400);
                    resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid Reservation ID in URL")));
                    return;
                }
            }

            processReservation(reservation, resp, true);
        } catch (com.google.gson.JsonSyntaxException | java.io.IOException e) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid JSON format or data: " + e.getMessage())));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Gson gson = com.oceanview.util.GsonUtil.getGson();

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Reservation ID required")));
            return;
        }

        try {
            int id = Integer.parseInt(pathInfo.substring(1));
            if (reservationDAO.deleteReservation(id)) {
                resp.getWriter().write(gson.toJson(ApiResponse.success("Reservation deleted", null)));
            } else {
                resp.setStatus(404);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Reservation not found")));
            }
        } catch (NumberFormatException e) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid ID format")));
        }
    }
}
