package com.oceanview.servlet;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.oceanview.dao.ReservationDAO;
import com.oceanview.model.Reservation;
import com.oceanview.util.ApiResponse;
import com.oceanview.util.GsonUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/admin/stats")
public class AdminStatsServlet extends HttpServlet {

    private final ReservationDAO reservationDAO = new ReservationDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Gson gson = GsonUtil.getGson();

        List<Reservation> reservations = reservationDAO.findAll();

        // Calculate Revenue
        BigDecimal totalRevenue = reservations.stream()
                .filter(r -> r.getStatus() == Reservation.Status.CONFIRMED || r.getStatus() == Reservation.Status.CHECKED_OUT)
                .map(Reservation::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Revenue by Month
        Map<Month, BigDecimal> revenueByMonth = new HashMap<>();
        for (Reservation r : reservations) {
            if (r.getStatus() == Reservation.Status.CONFIRMED || r.getStatus() == Reservation.Status.CHECKED_OUT) {
                Month month = r.getCheckIn().getMonth();
                revenueByMonth.put(month, revenueByMonth.getOrDefault(month, BigDecimal.ZERO).add(r.getTotalAmount()));
            }
        }

        List<Map<String, Object>> revenueData = revenueByMonth.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("month", entry.getKey().toString());
                    map.put("revenue", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        // Status Counts
        Map<Reservation.Status, Long> statusCounts = reservations.stream()
                .collect(Collectors.groupingBy(Reservation::getStatus, Collectors.counting()));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("revenueByMonth", revenueData);
        stats.put("totalBookings", reservations.size());
        stats.put("confirmedBookings", statusCounts.getOrDefault(Reservation.Status.CONFIRMED, 0L));
        stats.put("pendingBookings", statusCounts.getOrDefault(Reservation.Status.PENDING, 0L));
        stats.put("checkedOutBookings", statusCounts.getOrDefault(Reservation.Status.CHECKED_OUT, 0L));

        resp.getWriter().write(gson.toJson(ApiResponse.success("Admin stats fetched", stats)));
    }
}
