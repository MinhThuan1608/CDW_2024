package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import com.fit.monopolysbapi.monopolysocketapi.model.Bag;
import com.fit.monopolysbapi.monopolysocketapi.model.Role;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.repository.UserRepository;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final Util util;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> getUserByUsername(String username) {
        var userOptional = userRepository.findByUsername(username);
        return userOptional;
    }

    public Optional<User> getUserByUsernameOrEmail(String identify) {
        var userOptional = userRepository.findByUsernameOrEmail(identify);
        return userOptional;
    }

    public boolean isEmailExist(String email){
        return userRepository.existsByEmail(email);
    }

    public boolean isValidEmail(String email){
        return util.isValidEmail(email);
    }

    public User register(String email, String password) {
        String id = util.generateId();
        while (userRepository.existsById(id)) id = util.generateId();
        User user = User.builder().id(id).email(email)
                .password(passwordEncoder.encode(password))
                .isNonLocked(true)
                .isConfirmEmail(false)
                .role(Role.USER)
                .build();
        userRepository.save(user);
        return user;
    }

    public boolean isUsernameExist(String username){
        return userRepository.existsByUsername(username);
    }

    public User initUser(User user, String username, Avatar avatar) {
        user.setUsername(username);
        user.setAvatar(avatar);
        return userRepository.save(user);
    }
    public User changeAvatar(User user, Avatar avatar) {
        user.setAvatar(avatar);
        return userRepository.save(user);
    }
    public User getOneUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }
    public Bag getBagByUserName(String username){
        if(userRepository.existsByUsername(username))
            return getOneUserByUsername(username).getBag();
        return null;
    }
}
