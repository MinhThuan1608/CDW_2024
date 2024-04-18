package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import com.fit.monopolysbapi.monopolysocketapi.model.Item;
import com.fit.monopolysbapi.monopolysocketapi.model.Role;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.repository.ItemRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.ProductRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.UserRepository;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ProductRepository productRepository;
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
    public User changeName(User user, String username) {
        user.setUsername(username);
        return userRepository.save(user);
    }
    public User getOneUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }
    public List<Item> getListItem(String id){
        if(!userRepository.existsById(id)) return null;
        return itemRepository.findAllByUserId(id);
    }
    public boolean haveChangeNameCard(String id){
        if(!userRepository.existsById(id)) return false;
        System.out.println(itemRepository.findItemByProductId("3"));
        return getListItem(id).contains(itemRepository.findItemByProductId("3"));
    }

}
