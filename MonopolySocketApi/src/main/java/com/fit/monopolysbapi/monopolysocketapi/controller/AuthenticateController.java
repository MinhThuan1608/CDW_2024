package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.repository.MatchRepository;
import com.fit.monopolysbapi.monopolysocketapi.request.LoginRequest;
import com.fit.monopolysbapi.monopolysocketapi.request.RegisterRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.AbstractResponse;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.UserService;
import com.fit.monopolysbapi.monopolysocketapi.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.NoSuchAlgorithmException;

@Controller
@RequiredArgsConstructor
@RequestMapping("/authenticate")
public class AuthenticateController {

    private final UserService userService;
    private final MatchRepository matchRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getIdentify(), request.getPassword()));
        var user = userService.getUserByUsernameOrEmail(request.getIdentify()).orElseThrow(() -> new UsernameNotFoundException("User not found!"));
        if (!user.isAccountNonLocked()) return ResponseEntity.status(403).body(new AbstractResponse(403, "Your account is blocked!", null));
        String jwtToken = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new AbstractResponse(200, "Login successfull!",
                UserResponse.builder().id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .avatar(user.getAvatar())
                        .isConfirmEmail(user.isConfirmEmail())
                        .token(jwtToken)
                        .money(user.getMoney())
                        .isConfirmEmail(user.isConfirmEmail())
                        .isNonLocked(user.isNonLocked())
                        .role(user.getRole()).build()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) throws NoSuchAlgorithmException {
        if (!userService.isValidEmail(request.getEmail())) return ResponseEntity.status(405).body(new AbstractResponse(405, "Your email is invalid!", null));
        if (userService.isEmailExist(request.getEmail())) return ResponseEntity.status(405).body(new AbstractResponse(405, "Your email have been used!", null));
        if (request.getPassword()==null || request.getPassword().length()<8) return ResponseEntity.status(405).body(new AbstractResponse(405, "The password must be at least 8 characters in length!", null));
        if (!request.getPassword().equals(request.getConfirmPassword())) return ResponseEntity.status(405).body(new AbstractResponse(405, "Confirm password must be same password!", null));
        User user = userService.register(request.getEmail(), request.getPassword());
        userService.sendVerifyMail(user);
        return ResponseEntity.ok(new AbstractResponse(200, "Register successfully!", user.getUserResponse()));
    }

}
