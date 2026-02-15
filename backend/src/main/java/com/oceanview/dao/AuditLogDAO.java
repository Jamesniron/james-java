package com.oceanview.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.oceanview.model.AuditLog;
import com.oceanview.util.DBUtil;

public class AuditLogDAO {

    public void createAuditLog(AuditLog log) {
        String sql = "INSERT INTO audit_logs (user_id, username, action, details) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, log.getUserId());
            stmt.setString(2, log.getUsername());
            stmt.setString(3, log.getAction());
            stmt.setString(4, log.getDetails());
            stmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Database Error: " + e.getMessage());
        }
    }

    public List<AuditLog> findAll() {
        List<AuditLog> logs = new ArrayList<>();
        String sql = "SELECT * FROM audit_logs ORDER BY timestamp DESC";
        try (Connection conn = DBUtil.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                AuditLog log = new AuditLog();
                log.setId(rs.getInt("id"));
                log.setUserId(rs.getInt("user_id"));
                log.setUsername(rs.getString("username"));
                log.setAction(rs.getString("action"));
                log.setDetails(rs.getString("details"));
                Timestamp ts = rs.getTimestamp("timestamp");
                if (ts != null) {
                    log.setTimestamp(ts.toLocalDateTime());
                }
                logs.add(log);
            }
        } catch (SQLException e) {
            System.err.println("Database Error: " + e.getMessage());
        }
        return logs;
    }
}
