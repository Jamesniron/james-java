package com.oceanview.test;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.oceanview.util.DBUtil;

public class DBCheck {

    public static void main(String[] args) {
        System.out.println("Checking Database Connection...");
        try (Connection conn = DBUtil.getConnection()) {
            System.out.println("✅ Connection successful!");

            String sql = "SELECT id, username, role FROM users";
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                System.out.println("Users in database:");
                while (rs.next()) {
                    System.out.printf(" - ID: %d, User: %s, Role: %s%n",
                            rs.getInt("id"), rs.getString("username"), rs.getString("role"));
                }
            }
        } catch (SQLException e) {
            System.err.println("❌ Database checking failed!");
            e.printStackTrace();
        }
    }
}
