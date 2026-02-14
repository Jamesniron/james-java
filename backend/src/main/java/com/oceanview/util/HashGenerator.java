package com.oceanview.util;
import at.favre.lib.crypto.bcrypt.BCrypt;

public class HashGenerator {
    public static void main(String[] args) {
        String password = "staff123";
        String hash = BCrypt.withDefaults().hashToString(12, password.toCharArray());
        System.out.println("PASSWORD_HASH:" + hash);
    }
}
