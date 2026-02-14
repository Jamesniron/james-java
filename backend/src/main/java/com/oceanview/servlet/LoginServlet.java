package com.oceanview.servlet;

import java.io.IOException;

import com.google.gson.Gson;
import com.oceanview.dao.UserDAO;
import com.oceanview.util.ApiResponse;
import com.oceanview.util.PasswordUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        
        LoginRequest loginRequest = null;
        try {
            loginRequest = gson.fromJson(req.getReader(), LoginRequest.class);
        } catch (Exception e) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid JSON")));
            return;
        }

        if (loginRequest == null || loginRequest.username == null || loginRequest.password == null) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid request parameters")));
            return;
        }
        
        final LoginRequest request = loginRequest;

        userDAO.findByUsername(request.username).ifPresentOrElse(user -> {
            if (PasswordUtil.verifyPassword(request.password, user.getPasswordHash())) {
                req.getSession().setAttribute("user", user);
                resp.setStatus(200);
                try {
                    resp.getWriter().write(gson.toJson(ApiResponse.success("Login successful", user)));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                resp.setStatus(401);
                try {
                    resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid credentials")));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }, () -> {
            resp.setStatus(401);
            try {
                resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid credentials")));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    private static class LoginRequest {
        String username;
        String password;
    }
}
