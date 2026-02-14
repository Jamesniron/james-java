package com.oceanview.servlet;

import java.io.IOException;
import java.util.List;

import com.google.gson.Gson;
import com.oceanview.dao.RoomDAO;
import com.oceanview.model.Room;
import com.oceanview.util.ApiResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/rooms")
public class RoomServlet extends HttpServlet {
    private final RoomDAO roomDAO = new RoomDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        List<Room> rooms = roomDAO.findAllRooms();
        resp.getWriter().write(gson.toJson(ApiResponse.success("Rooms fetched", rooms)));
    }
}
