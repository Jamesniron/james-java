package com.oceanview.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import com.google.gson.Gson;
import com.oceanview.util.ApiResponse;
import com.oceanview.util.DBUtil;
import com.oceanview.util.GsonUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/test-db")
public class TestDBServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Gson gson = GsonUtil.getGson();

        try (Connection conn = DBUtil.getConnection()) {
            if (conn != null && !conn.isClosed()) {
                resp.getWriter().write(gson.toJson(ApiResponse.success("Database connection successful! URL: " + conn.getMetaData().getURL(), null)));
            } else {
                resp.setStatus(500);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Connection obtained but is closed or null.")));
            }
        } catch (SQLException e) {
            resp.setStatus(500);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Database connection failed: " + e.getMessage())));
        }
    }
}
