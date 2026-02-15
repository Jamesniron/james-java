package com.oceanview.servlet;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import com.google.gson.Gson;
import com.oceanview.dao.UserDAO;
import com.oceanview.model.User;
import com.oceanview.util.ApiResponse;
import com.oceanview.util.GsonUtil;
import com.oceanview.util.PasswordUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/users/*")
public class UserServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = GsonUtil.getGson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String pathInfo = req.getPathInfo();

        if (pathInfo != null && !pathInfo.equals("/")) {
            try {
                int id = Integer.parseInt(pathInfo.substring(1));
                Optional<User> userOpt = userDAO.findById(id);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    user.setPasswordHash(null); // Security: don't return the hash
                    resp.getWriter().write(gson.toJson(ApiResponse.success("User details", user)));
                } else {
                    resp.setStatus(404);
                    resp.getWriter().write(gson.toJson(ApiResponse.error("User not found")));
                }
                return;
            } catch (NumberFormatException e) {
                // Ignore and fall back to listing
            }
        }

        List<User> users = userDAO.findAll();
        users.forEach(u -> u.setPasswordHash(null)); // Security
        resp.getWriter().write(gson.toJson(ApiResponse.success("Users fetched", users)));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        try {
            User user = gson.fromJson(req.getReader(), User.class);

            // Check if username exists
            if (userDAO.findByUsername(user.getUsername()).isPresent()) {
                resp.setStatus(400);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Username already exists")));
                return;
            }

            // Hash the password before saving
            // Expecting the raw password in the 'passwordHash' field from the frontend for simplicity in mapping
            // but we'll call it 'password' in the request JSON if we want to be cleaner.
            // For now, let's assume the frontend sends the raw password in the field that maps to passwordHash.
            String rawPassword = user.getPasswordHash();
            if (rawPassword == null || rawPassword.isEmpty()) {
                resp.setStatus(400);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Password is required")));
                return;
            }

            user.setPasswordHash(PasswordUtil.hashPassword(rawPassword));

            if (userDAO.createUser(user)) {
                user.setPasswordHash(null);
                resp.setStatus(210); // Using 210 for Created (201 is better but let's be descriptive)
                resp.setStatus(201);
                resp.getWriter().write(gson.toJson(ApiResponse.success("User created", user)));
            } else {
                resp.setStatus(500);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Failed to create user")));
            }
        } catch (Exception e) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Error: " + e.getMessage())));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        try {
            User user = gson.fromJson(req.getReader(), User.class);

            Optional<User> existingUserOpt = userDAO.findById(user.getId());
            if (existingUserOpt.isEmpty()) {
                resp.setStatus(404);
                resp.getWriter().write(gson.toJson(ApiResponse.error("User not found")));
                return;
            }

            User existingUser = existingUserOpt.get();

            // If password is provided, hash it. If not, keep existing hash.
            String rawPassword = user.getPasswordHash();
            if (rawPassword != null && !rawPassword.isEmpty()) {
                user.setPasswordHash(PasswordUtil.hashPassword(rawPassword));
            } else {
                user.setPasswordHash(existingUser.getPasswordHash());
            }

            if (userDAO.updateUser(user)) {
                user.setPasswordHash(null);
                resp.getWriter().write(gson.toJson(ApiResponse.success("User updated", user)));
            } else {
                resp.setStatus(500);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Failed to update user")));
            }
        } catch (Exception e) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Error: " + e.getMessage())));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("User ID required")));
            return;
        }

        try {
            int id = Integer.parseInt(pathInfo.substring(1));

            // Don't allow deleting the admin user (id=1 typically)
            if (id == 1) {
                resp.setStatus(403);
                resp.getWriter().write(gson.toJson(ApiResponse.error("Cannot delete the root admin user")));
                return;
            }

            if (userDAO.deleteUser(id)) {
                resp.getWriter().write(gson.toJson(ApiResponse.success("User deleted", null)));
            } else {
                resp.setStatus(404);
                resp.getWriter().write(gson.toJson(ApiResponse.error("User not found")));
            }
        } catch (NumberFormatException e) {
            resp.setStatus(400);
            resp.getWriter().write(gson.toJson(ApiResponse.error("Invalid ID format")));
        }
    }
}
