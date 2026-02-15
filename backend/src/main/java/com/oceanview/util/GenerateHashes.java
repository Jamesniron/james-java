package com.oceanview.util;

import java.io.FileWriter;
import java.io.IOException;

public class GenerateHashes {

    public static void main(String[] args) throws IOException {
        String adminHash = PasswordUtil.hashPassword("admin123");
        String staffHash = PasswordUtil.hashPassword("staff123");

        try (FileWriter writer = new FileWriter("hashes.txt")) {
            writer.write("admin: " + adminHash + "\n");
            writer.write("staff: " + staffHash + "\n");
        }
        System.out.println("Hashes generated in hashes.txt");
    }
}
