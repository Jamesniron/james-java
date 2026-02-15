package com.oceanview.util;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

import com.oceanview.dao.UserDAO;
import com.oceanview.model.User;

public class CheckDB {

    public static void main(String[] args) {
        System.out.println("--- Checking Database Tables ---");
        try (java.sql.Connection conn = DBUtil.getConnection()) {
            System.out.println("Connected to: " + conn.getCatalog());
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery("SHOW TABLES")) {
                while (rs.next()) {
                    System.out.println("Table: " + rs.getString(1));
                }
            }

            UserDAO userDAO = new UserDAO();
            Optional<User> admin = userDAO.findByUsername("admin");
            if (admin.isPresent()) {
                System.out.println("Admin found: " + admin.get().getPasswordHash());
            } else {
                System.out.println("Admin NOT found!");
            }

            Optional<User> staff = userDAO.findByUsername("staff");
            if (staff.isPresent()) {
                System.out.println("Staff found: " + staff.get().getPasswordHash());
            } else {
                System.out.println("Staff NOT found!");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        System.out.println("--- End Check ---");
    }
}
