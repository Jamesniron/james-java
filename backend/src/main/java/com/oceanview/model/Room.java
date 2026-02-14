package com.oceanview.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Room {
    private int id;
    private int roomNumber;
    private RoomType type;
    private BigDecimal pricePerNight;
    private boolean isAvailable;
    private LocalDateTime createdAt;

    public enum RoomType {
        Single, Double, Deluxe, Suite
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getRoomNumber() { return roomNumber; }
    public void setRoomNumber(int roomNumber) { this.roomNumber = roomNumber; }
    
    public RoomType getType() { return type; }
    public void setType(RoomType type) { this.type = type; }
    
    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }
    
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
