package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.*;
import com.fit.monopolysbapi.monopolysocketapi.repository.ItemRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.UserRepository;
import com.fit.monopolysbapi.monopolysocketapi.response.ListUserResponseAdmin;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final Util util;
    private final PasswordEncoder passwordEncoder;


    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsernameOrEmail(String identify) {
        return userRepository.findByUsernameOrEmail(identify);
    }

    public boolean isEmailExist(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean isValidEmail(String email) {
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
                .createDate(new Date())
                .build();
        userRepository.save(user);
        return user;
    }

    public boolean isUsernameExist(String username) {
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

    public User changeName(User user, String username) {
        user.setUsername(username);
        updateChangeNameCard(user);
        return userRepository.save(user);
    }
    public void updateChangeNameCard(User user) {
        for (Item item : getListItem(user.getId())) {
            if (item.getProduct().getId().equals("2")) {
                if (item.getQuantity() > 1) {
                    item.setQuantity(item.getQuantity() - 1);
                    itemRepository.save(item);
                } else {
                    itemRepository.delete(item);
                }

            }
        }
    }
    public List<Item> getListItem(String id){
        if(!userRepository.existsById(id)) return null;
        return itemRepository.findAllByUserId(id);
    }

    public boolean haveChangeNameCard(String id) {
        if (!userRepository.existsById(id)) return false;
        List<Item> itemList = itemRepository.findAllByProductIdAndUserId("2",id);
        return !itemList.isEmpty();
    }

    private String getVerifyEmailURL(User user) throws NoSuchAlgorithmException {
        return "http://chessgame.ddns.net:8001/user/verify_email/" + user.getId() + "?token=" + util.hash(user.getPassword());
    }

    private String getForgetPasswordURL(String token) {
        return "http://chessgame.ddns.net/reset-password?token=" + token;
    }

    public void sendVerifyMail(User user) throws NoSuchAlgorithmException {
        String subject = "Xác thực Email game CỜ VUA ONLINE";
        String content = "<p>Để xác thực email, bạn vui lòng click vào bút bên dưới:</p>" +
                "<a href=\"" + getVerifyEmailURL(user) + "\">" +
                "<button style=\"padding: 10px 20px;border-radius: 5px;border: none;font-weight: bold;color: white;background-color: #4646ff;cursor: pointer;\">Xác thực</button></a>";
        util.sendEmail(user.getEmail(), subject, content);
    }

    public void sendForgetPasswordMail(String email, String token) {
        String subject = "Yêu cầu reset mật khẩu game CỜ VUA ONLINE";
        String content = "<p>Để reset mật khẩu, bạn vui lòng click vào bút bên dưới:</p>" +
                "<a href=\"" + getForgetPasswordURL(token) + "\">" +
                "<button style=\"padding: 10px 20px;border-radius: 5px;border: none;font-weight: bold;color: white;background-color: #4646ff;cursor: pointer;\">Đổi mật khẩu</button></a>" +
                "<p>Link sẽ hết hạn sau 5 phút.</p>" +
                "<p>Nếu bạn không yêu cầu reset mật khẩu thì vui lòng bỏ qua email này.</p>";
        util.sendEmail(email, subject, content);
    }

    public boolean checkVerifyEmailToken(User user, String token) throws NoSuchAlgorithmException {
        return util.hash(user.getPassword()).equals(token);
    }

    public void verifyEmail(User user) {
        user.setConfirmEmail(true);
        userRepository.save(user);
    }

    public void changePassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public void save(User user){
        userRepository.save(user);
    }

    public Page<User> searchUsers(String username, Pageable pageable) {
        return userRepository.findByUsernameContaining(username, pageable);
    }

}
