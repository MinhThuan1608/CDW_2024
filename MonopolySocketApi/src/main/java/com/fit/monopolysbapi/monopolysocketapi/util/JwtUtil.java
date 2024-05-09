package com.fit.monopolysbapi.monopolysocketapi.util;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    public static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60 * 1000;
    public static final long JWT_EMAIl_TOKEN_VALIDITY = 3 * 60 * 1000;
    private final Environment env;

    public enum TokenType {
        AUTHENTICATE, EMAIL
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(Base64.getEncoder().encode(env.getProperty("jwt.key").getBytes()));
    }

    public String getIdFromToken(String token) {
        final Claims claims = getAllClaimsFromToken(token);
        return claims.getSubject();
    }

    public Date getExpirationDateFromToken(String token) {
        final Claims claims = getAllClaimsFromToken(token);
        return claims.getExpiration();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public String generateToken(UserDetails userDetails, TokenType tokenType) {
        User user = (User) userDetails;
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", tokenType);
        return Jwts.builder().setClaims(claims).setSubject(user.getId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()
                        + (tokenType.equals(TokenType.AUTHENTICATE) ? JWT_TOKEN_VALIDITY : JWT_EMAIl_TOKEN_VALIDITY)))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512).compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        User user = (User) userDetails;
        final String id = getIdFromToken(token);
        return id.equals(user.getId()) && !isTokenExpired(token);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }
}
