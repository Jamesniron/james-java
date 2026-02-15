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

        try {
            System.out.println("Login attempt for user: " + request.username);
            var userOptional = userDAO.findByUsername(request.username);

            if (userOptional.isPresent()) {
                var user = userOptional.get();
                if (PasswordUtil.verifyPassword(request.password, user.getPasswordHash())) {
                    req.getSession().setAttribute("user", user);
                    resp.setStatus(200);
                    resp.getWriter().write(gson.toJson(ApiResponse.success("Login successful", user)));
                } else {
                    resp.setStatus(401);
                    resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid credentials")));
                }
            } else {
                resp.setStatus(401);
                resp.getWriter().write(gson.toJson(ApiResponse.error("User not found")));
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("LoginServlet Error: " + e.getMessage());
            resp.setStatus(500);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Server Error: " + e.getMessage())));
        }
    }

    public static class LoginRequest {

        public String username;
        public String password;
    }
}
