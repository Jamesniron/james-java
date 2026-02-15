package com.oceanview.servlet;

import java.io.IOException;

import com.google.gson.Gson;
import com.oceanview.util.ApiResponse;
import com.oceanview.util.GsonUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/logout")
public class LogoutServlet extends HttpServlet {

    private final Gson gson = GsonUtil.getGson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        resp.setContentType("application/json");
        resp.setStatus(200);
        resp.getWriter().write(gson.toJson(ApiResponse.success("Logged out successfully", null)));
    }
}
