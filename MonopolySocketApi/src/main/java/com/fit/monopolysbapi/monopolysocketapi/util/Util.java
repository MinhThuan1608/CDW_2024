package com.fit.monopolysbapi.monopolysocketapi.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class Util {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int ID_LENGTH = 15;
    public String generateId(){
        StringBuilder randomId = new StringBuilder(ID_LENGTH);
        SecureRandom random = new SecureRandom();

        for (int i = 0; i < ID_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            char randomChar = CHARACTERS.charAt(randomIndex);
            randomId.append(randomChar);
        }

        return randomId.toString();
    }
}
