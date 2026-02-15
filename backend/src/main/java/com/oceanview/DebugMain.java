package com.oceanview;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.oceanview.util.DBUtil;
import com.oceanview.util.PasswordUtil;

public class DebugMain {
    public static void main(String[] args) {
        System.out.println("--- Starting Debug ---");
        try (Connection conn = DBUtil.getConnection()) {
            System.out.println("Database connection successful!");
            
            String sql = "SELECT username, password_hash FROM users";
            try (PreparedStatement stmt = conn.prepareStatement(sql);
                 ResultSet rs = stmt.executeQuery()) {
                
                while (rs.next()) {
                    String username = rs.getString("username");
                    String hash = rs.getString("password_hash");
                    System.out.println("Found user: " + username);
                    
                    if ("admin".equals(username)) {
                        boolean match = PasswordUtil.verifyPassword("password", hash);
                        System.out.println("  Admin password 'password' match: " + match);
                    } else if ("staff".equals(username)) {
                         boolean match = PasswordUtil.verifyPassword("staff123", hash);
                         System.out.println("  Staff password 'staff123' match: " + match);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("--- End Debug ---");
    }
}
