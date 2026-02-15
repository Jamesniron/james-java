package com.oceanview.util;

public class TestHash {

    public static void main(String[] args) {
        String adminHash = "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW";
        String staffHash = "$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgdtix7HE8n.shnV767T1L.A6SBy";

        System.out.println("Admin match: " + PasswordUtil.verifyPassword("password", adminHash));
        System.out.println("Staff match: " + PasswordUtil.verifyPassword("staff123", staffHash));

        System.out.println("New hash for 'password': " + PasswordUtil.hashPassword("password"));
        System.out.println("New hash for 'staff123': " + PasswordUtil.hashPassword("staff123"));
    }
}
