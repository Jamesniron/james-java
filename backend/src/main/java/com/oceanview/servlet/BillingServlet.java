package com.oceanview.servlet;

import java.io.IOException;
import java.util.Optional;

import com.oceanview.dao.ReservationDAO;
import com.oceanview.model.Reservation;
import com.oceanview.util.ApiResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/billing/*")
public class BillingServlet extends HttpServlet {

    private final ReservationDAO reservationDAO = new ReservationDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        com.google.gson.Gson gson = com.oceanview.util.GsonUtil.getGson();

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(404);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Reservation ID required")));
            return;
        }

        try {
            int id = Integer.parseInt(pathInfo.substring(1));
            Optional<Reservation> reservationOpt = reservationDAO.findById(id);

            if (reservationOpt.isPresent()) {
                resp.getWriter().write(gson.toJson(ApiResponse.success("Bill details", reservationOpt.get())));
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
