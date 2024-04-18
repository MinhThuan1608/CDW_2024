package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import com.fit.monopolysbapi.monopolysocketapi.model.Role;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.repository.UserRepository;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.core.env.Environment;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final Util util;
    private final PasswordEncoder passwordEncoder;
    private final Environment env;


    public Optional<User> getUserByUsername(String username) {
        var userOptional = userRepository.findByUsername(username);
        return userOptional;
    }

    public Optional<User> getUserById(String id) {
        var userOptional = userRepository.findById(id);
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

    private String getVerifyEmailURL(User user) throws NoSuchAlgorithmException {
        return "http://localhost:8001/user/verify_email/"+user.getId()+"?token="+util.hash(user.getPassword());
    }

    public void sendVerifyMail(User user) throws NoSuchAlgorithmException {
        String subject = "Xác thực Email game CỜ VUA ONLINE";
        String content = "<p>Để xác thực email, bạn vui lòng click vào bút bên dưới:</p>" +
                "<a href=\""+getVerifyEmailURL(user)+"\">" +
                "<button style=\"padding: 10px 20px;border-radius: 5px;border: none;font-weight: bold;color: white;background-color: #4646ff;cursor: pointer;\">Xác thực</button></a>";
        util.sendEmail(user.getEmail(), subject, content);
    }


    public boolean checkVerifyEmailToken(User user, String token) throws NoSuchAlgorithmException {
        return util.hash(user.getPassword()).equals(token);
    }

    public void verifyEmail(User user) {
        user.setConfirmEmail(true);
        userRepository.save(user);
    }

}
