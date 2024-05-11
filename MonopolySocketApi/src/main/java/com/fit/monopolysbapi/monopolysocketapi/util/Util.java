package com.fit.monopolysbapi.monopolysocketapi.util;

import org.springframework.stereotype.Component;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class Util {

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
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

    public boolean isValidEmail(String email){
        if (email == null) return false;
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public boolean sendEmail(String to, String subject, String content) {
        String from = "20130426@st.hcmuaf.edu.vn";

        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "465");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.socketFactory.port", "465");
        prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, "xkxtwmuuhqarixnr");
            }
        });
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(to));
            message.setSubject(subject);
            message.setText(content, "UTF-8", "html");
            Transport.send(message);
            return true;
        } catch (MessagingException e) {
            return false;
        }
    }

    public String hash(String inp) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-512/256");
        byte[] bytes = digest.digest(inp.getBytes());
        BigInteger bigInteger = new BigInteger(1, bytes);
        return bigInteger.toString(16);
    }
}
