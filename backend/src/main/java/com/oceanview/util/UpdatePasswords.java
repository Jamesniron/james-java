package com.oceanview.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UpdatePasswords {

    public static void main(String[] args) {
        updatePassword("admin", "admin123");
        updatePassword("staff", "staff123");
    }

    private static void updatePassword(String username, String newPassword) {
        String hash = PasswordUtil.hashPassword(newPassword);
        String sql = "UPDATE users SET password_hash = ? WHERE username = ?";

        try (Connection conn = DBUtil.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, hash);
            stmt.setString(2, username);

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                System.out.println("Successfully updated password for: " + username);
                System.out.println("New Hash: " + hash);
            } else {
                System.out.println("User not found: " + username);
            }

        } catch (SQLException e) {
            System.err.println("Error updating password for " + username + ": " + e.getMessage());
        }
    }
}
