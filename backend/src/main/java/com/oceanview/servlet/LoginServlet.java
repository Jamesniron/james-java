package com.oceanview.servlet;

import java.io.IOException;
import java.sql.SQLException;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.oceanview.dao.UserDAO;
import com.oceanview.util.ApiResponse;
import com.oceanview.util.GsonUtil;
import com.oceanview.util.PasswordUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = GsonUtil.getGson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");

        LoginRequest loginRequest = null;
        try {
            loginRequest = gson.fromJson(req.getReader(), LoginRequest.class);
        } catch (JsonSyntaxException | JsonIOException e) { // Modified catch block
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

                    // Audit Log
                    com.oceanview.dao.AuditLogDAO auditLogDAO = new com.oceanview.dao.AuditLogDAO();
                    com.oceanview.model.AuditLog log = new com.oceanview.model.AuditLog(
                            user.getId(), user.getUsername(), "LOGIN", "User logged in successfully"
                    );
                    auditLogDAO.createAuditLog(log);

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
        } catch (SQLException e) { // Modified catch block
            System.err.println("LoginServlet Database Error: " + e.getMessage());
            resp.setStatus(500);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Database Error")));
        } catch (Exception e) { // Modified catch block
            System.err.println("LoginServlet Unexpected Error: " + e.getMessage());
            resp.setStatus(500);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Server Error")));
        }
    }

    public static class LoginRequest {

        public String username;
        public String password;
    }
}
