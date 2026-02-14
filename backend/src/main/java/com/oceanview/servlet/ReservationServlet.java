package com.oceanview.servlet;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import com.google.gson.Gson;
import com.oceanview.dao.ReservationDAO;
import com.oceanview.dao.RoomDAO;
import com.oceanview.model.Reservation;
import com.oceanview.model.Room;
import com.oceanview.model.User;
import com.oceanview.util.ApiResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/reservations")
public class ReservationServlet extends HttpServlet {
    private final ReservationDAO reservationDAO = new ReservationDAO();
    private final RoomDAO roomDAO = new RoomDAO();


    public ReservationServlet() {
        // Gson needs type adapter for LocalDate usually, unless gson 2.10+ does it automatically?
        // It often doesn't. Simple Gson doesn't handle Java 8 dates by default well.
        // I should stick to GsonBuilder.
    }
    
    // Better Gson instance
    private Gson getGson() {
        return new com.google.gson.GsonBuilder()
            .registerTypeAdapter(LocalDate.class, new com.google.gson.JsonSerializer<LocalDate>() {
                @Override
                public com.google.gson.JsonElement serialize(LocalDate src, java.lang.reflect.Type typeOfSrc, com.google.gson.JsonSerializationContext context) {
                    return new com.google.gson.JsonPrimitive(src.toString());
                }
            })
            .registerTypeAdapter(LocalDate.class, new com.google.gson.JsonDeserializer<LocalDate>() {
                @Override
                public LocalDate deserialize(com.google.gson.JsonElement json, java.lang.reflect.Type typeOfT, com.google.gson.JsonDeserializationContext context) throws com.google.gson.JsonParseException {
                    return LocalDate.parse(json.getAsString());
                }
            })
             .registerTypeAdapter(java.time.LocalDateTime.class, new com.google.gson.JsonSerializer<java.time.LocalDateTime>() {
                @Override
                public com.google.gson.JsonElement serialize(java.time.LocalDateTime src, java.lang.reflect.Type typeOfSrc, com.google.gson.JsonSerializationContext context) {
                    return new com.google.gson.JsonPrimitive(src.toString());
                }
            })
             .registerTypeAdapter(java.time.LocalDateTime.class, new com.google.gson.JsonDeserializer<java.time.LocalDateTime>() {
                @Override
                public java.time.LocalDateTime deserialize(com.google.gson.JsonElement json, java.lang.reflect.Type typeOfT, com.google.gson.JsonDeserializationContext context) throws com.google.gson.JsonParseException {
                    return java.time.LocalDateTime.parse(json.getAsString());
                }
            })
            .create();
    }


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Gson gson = getGson();
        
        User user = (User) req.getSession().getAttribute("user");
        if (user == null) {
            resp.setStatus(401);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Unauthorized")));
            return;
        }

        List<Reservation> reservations = reservationDAO.findAll();
        resp.getWriter().write(gson.toJson(ApiResponse.success("Reservations fetched", reservations)));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Gson gson = getGson();
        
        User user = (User) req.getSession().getAttribute("user");
        if (user == null) {
            resp.setStatus(401);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Unauthorized")));
            return;
        }

        Reservation reservation;
        try {
            reservation = gson.fromJson(req.getReader(), Reservation.class);
        } catch (Exception e) {
             resp.setStatus(400);
             resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid JSON format")));
             return;
        }

        // Validate
        if (reservation.getCheckIn().isAfter(reservation.getCheckOut())) {
            resp.setStatus(400);
             resp.getWriter().write(gson.toJson(ApiResponse.error("Check-out date must be after check-in date")));
             return;
        }
        
        // Check availability
        if (!reservationDAO.isRoomAvailable(reservation.getRoomId(), reservation.getCheckIn(), reservation.getCheckOut())) {
             resp.setStatus(409); // Conflict
             resp.getWriter().write(gson.toJson(ApiResponse.error("Room not available for selected dates")));
             return;
        }
        
        // Calculate details
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        if (nights < 1) nights = 1;
        reservation.setTotalNights((int) nights);
        
        // Get Room price
        List<Room> rooms = roomDAO.findAllRooms(); // inefficient but works for small app
        Optional<Room> roomOpt = rooms.stream().filter(r -> r.getId() == reservation.getRoomId()).findFirst();
        
        if (roomOpt.isEmpty()) {
             resp.setStatus(400);
             resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid Room ID")));
             return;
        }
        
        BigDecimal price = roomOpt.get().getPricePerNight();
        BigDecimal total = price.multiply(BigDecimal.valueOf(nights));
        // Add 10% tax
        BigDecimal tax = total.multiply(BigDecimal.valueOf(0.10));
        reservation.setTotalAmount(total.add(tax));
        
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
    }
}
