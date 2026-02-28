package com.oceanview.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class DatabaseInitializer implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("Initializing Database (MySQL)...");

        // Assume running from project root (backend folder) mechanism for dev
        Path schemaPath = Paths.get("database/schema.sql");

        // In a real war deployment, this file path strategy is brittle, 
        // but for 'mvn cargo:run' from the backend folder, it works perfectly.
        if (!Files.exists(schemaPath)) {
            System.err.println("Database schema file not found at: " + schemaPath.toAbsolutePath());
            return;
        }

        try (Connection conn = DBUtil.getConnection(); Statement stmt = conn.createStatement()) {

            String sql = Files.readString(schemaPath);
            stmt.execute(sql);
            System.out.println("Database schema executed successfully!");

            // Seed default users with properly hashed passwords
            seedDefaultUsers(conn);

        } catch (SQLException | IOException e) {
            System.err.println("Error initializing database:");
            e.printStackTrace();
        }
    }

    private void seedDefaultUsers(Connection conn) throws SQLException {
        // Check if admin exists, and update password hash to ensure it matches
        upsertUser(conn, "admin", "password", "ADMIN");
        upsertUser(conn, "staff", "staff123", "STAFF");
        System.out.println("Default users seeded/updated successfully!");
    }

    private void upsertUser(Connection conn, String username, String plainPassword, String role) throws SQLException {
        String hash = PasswordUtil.hashPassword(plainPassword);

        // Check if user exists
        String checkSql = "SELECT id FROM users WHERE username = ?";
        try (PreparedStatement ps = conn.prepareStatement(checkSql)) {
            ps.setString(1, username);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    // User exists — update password hash to ensure it's correct
                    String updateSql = "UPDATE users SET password_hash = ? WHERE username = ?";
                    try (PreparedStatement ups = conn.prepareStatement(updateSql)) {
                        ups.setString(1, hash);
                        ups.setString(2, username);
                        ups.executeUpdate();
                    }
                } else {
                    // User doesn't exist — insert
                    String insertSql = "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)";
                    try (PreparedStatement ips = conn.prepareStatement(insertSql)) {
                        ips.setString(1, username);
                        ips.setString(2, hash);
                        ips.setString(3, role);
                        ips.executeUpdate();
                    }
                }
            }
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Optional cleanup
    }
}
