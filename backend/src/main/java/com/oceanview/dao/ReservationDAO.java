package com.oceanview.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.oceanview.model.Reservation;
import com.oceanview.util.DBUtil;

public class ReservationDAO {

    public boolean isRoomAvailable(int roomId, LocalDate checkIn, LocalDate checkOut) {
        return isRoomAvailable(roomId, checkIn, checkOut, -1);
    }

    public boolean isRoomAvailable(int roomId, LocalDate checkIn, LocalDate checkOut, int excludeId) {
        String sql = "SELECT COUNT(*) FROM reservations WHERE room_id = ? AND status IN ('CONFIRMED', 'PENDING') "
                + "AND id != ? AND NOT (check_out <= ? OR check_in >= ?)";
        try (Connection conn = DBUtil.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, roomId);
            stmt.setInt(2, excludeId);
            stmt.setDate(3, Date.valueOf(checkIn));
            stmt.setDate(4, Date.valueOf(checkOut)); // Logic: overlap if (CheckIn_New < CheckOut_Old) AND (CheckOut_New > CheckIn_Old)

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) == 0;
            }
        } catch (SQLException e) {
            System.err.println("SQL Error: " + e.getMessage());
        }
        return false;
    }

    public int createReservation(Reservation reservation) {
        String sql = "INSERT INTO reservations (guest_name, address, contact_number, room_id, check_in, check_out, total_nights, total_amount, status) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, reservation.getGuestName());
            stmt.setString(2, reservation.getAddress());
            stmt.setString(3, reservation.getContactNumber());
            stmt.setInt(4, reservation.getRoomId());
            stmt.setDate(5, Date.valueOf(reservation.getCheckIn()));
            stmt.setDate(6, Date.valueOf(reservation.getCheckOut()));
            stmt.setInt(7, reservation.getTotalNights());
            stmt.setBigDecimal(8, reservation.getTotalAmount());
            stmt.setString(9, reservation.getStatus().name());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                ResultSet generatedKeys = stmt.getGeneratedKeys();
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
            }
        } catch (SQLException e) {
            System.err.println("SQL Error: " + e.getMessage());
        }
        return -1;
    }

    public Optional<Reservation> findById(int id) {
        String sql = "SELECT r.*, rm.type, rm.room_number FROM reservations r JOIN rooms rm ON r.room_id = rm.id WHERE r.id = ?";
        try (Connection conn = DBUtil.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return Optional.of(mapResultSetToReservation(rs));
            }
        } catch (SQLException e) {
            System.err.println("SQL Error: " + e.getMessage());
        }
        return Optional.empty();
    }

    public List<Reservation> findAll() {
        List<Reservation> reservations = new ArrayList<>();
        String sql = "SELECT r.*, rm.type, rm.room_number FROM reservations r JOIN rooms rm ON r.room_id = rm.id ORDER BY r.created_at DESC";
        try (Connection conn = DBUtil.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                reservations.add(mapResultSetToReservation(rs));
            }
        } catch (SQLException e) {
            System.err.println("SQL Error while finding all reservations: " + e.getMessage());
        }
        return reservations;
    }

    public boolean updateReservation(Reservation reservation) {
        String sql = "UPDATE reservations SET guest_name=?, address=?, contact_number=?, room_id=?, check_in=?, check_out=?, total_nights=?, total_amount=?, status=? WHERE id=?";
        try (Connection conn = DBUtil.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, reservation.getGuestName());
            stmt.setString(2, reservation.getAddress());
            stmt.setString(3, reservation.getContactNumber());
            stmt.setInt(4, reservation.getRoomId());
            stmt.setDate(5, Date.valueOf(reservation.getCheckIn()));
            stmt.setDate(6, Date.valueOf(reservation.getCheckOut()));
            stmt.setInt(7, reservation.getTotalNights());
            stmt.setBigDecimal(8, reservation.getTotalAmount());
            stmt.setString(9, reservation.getStatus().name());
            stmt.setInt(10, reservation.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("SQL Error: " + e.getMessage());
        }
        return false;
    }

    public boolean deleteReservation(int id) {
        String sql = "DELETE FROM reservations WHERE id=?";
        try (Connection conn = DBUtil.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("SQL Error: " + e.getMessage());
        }
        return false;
    }

    private Reservation mapResultSetToReservation(ResultSet rs) throws SQLException {
        Reservation r = new Reservation();
        r.setId(rs.getInt("id"));
        r.setGuestName(rs.getString("guest_name"));
        r.setAddress(rs.getString("address"));
        r.setContactNumber(rs.getString("contact_number"));
        r.setRoomId(rs.getInt("room_id"));
        r.setCheckIn(rs.getDate("check_in").toLocalDate());
        r.setCheckOut(rs.getDate("check_out").toLocalDate());
        r.setTotalNights(rs.getInt("total_nights"));
        r.setTotalAmount(rs.getBigDecimal("total_amount"));
        r.setStatus(Reservation.Status.valueOf(rs.getString("status")));
        r.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        r.setRoomType(rs.getString("type"));
        r.setRoomNumber(rs.getInt("room_number"));
        return r;
    }
}
