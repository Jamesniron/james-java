package com.oceanview.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class DatabaseInitializer implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("Initializing Database (H2)...");

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

            // H2 can process multiple statements in one execute call
            stmt.execute(sql);
            System.out.println("Database schema executed successfully!");

        } catch (SQLException | IOException e) {
            System.err.println("Error initializing database:");
            e.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Optional cleanup
    }
}
