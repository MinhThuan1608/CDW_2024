package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import com.fit.monopolysbapi.monopolysocketapi.model.Item;
import com.fit.monopolysbapi.monopolysocketapi.model.Product;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.InitUserRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.AbstractResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.AvatarService;
import com.fit.monopolysbapi.monopolysocketapi.service.ProductService;
import com.fit.monopolysbapi.monopolysocketapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final AvatarService avatarService;

    @PatchMapping("/init")
    public ResponseEntity initUser(@RequestBody InitUserRequest request, Authentication authentication) {
        String imageId = request.getDefaultAvatarId();
        Avatar avatar = null;
        if (userService.isUsernameExist(request.getUsername()))
            return ResponseEntity.ok(new AbstractResponse(405, "This username have been used!!!", false));

        if (imageId != null && !imageId.isEmpty()) {
            if (!avatarService.isImageDefaultExist(imageId))
                return ResponseEntity.ok(new AbstractResponse(405, "Avatar, that you provide, is not exists", false));
            avatar = avatarService.getAvatarById(imageId);
        } else if(request.getAvatar() != null) {
            String base64Data = request.getAvatar();
            String[] parts = base64Data.split(",");
            String base64String = parts[1];
            int imageLength = Base64.getDecoder().decode(base64String).length;
            if (imageLength > 1048576)
                return ResponseEntity.ok(new AbstractResponse(405, "Avatar must be less than 1MB", false));
            avatar = avatarService.addAvatar(request.getAvatar());

        }

        User updatedUser = userService.initUser((User) authentication.getPrincipal(), request.getUsername(), avatar);
        return ResponseEntity.ok().body(new AbstractResponse(200, "Username and avatar have been setted!", updatedUser.getUserResponse()));
    }

    @PatchMapping("/edit/avatar")
    public ResponseEntity editProfileAvatar(@RequestBody InitUserRequest request, Authentication authentication) {
        if (request.getAvatar() == null)
            return ResponseEntity.ok().body(new AbstractResponse(200, "Avatar not available!", false));

        Avatar avatar;
        String base64Data = request.getAvatar();
        String[] parts = base64Data.split(",");
        String base64String = parts[1];
        int imageLength = Base64.getDecoder().decode(base64String).length;
        if (imageLength > 1048576)
            return ResponseEntity.ok(new AbstractResponse(405, "Avatar must be less than 1MB", false));
        avatar = avatarService.addAvatar(request.getAvatar());

        User updatedUser = userService.changeAvatar((User) authentication.getPrincipal(), avatar);
        return ResponseEntity.ok().body(new AbstractResponse(200, "Avatar have been updated!", updatedUser.getUserResponse()));


    }
    @PatchMapping("/edit/name")
    public ResponseEntity editProfileName(@RequestBody InitUserRequest request, Authentication authentication) {
        if (userService.isUsernameExist(request.getUsername()))
            return ResponseEntity.ok(new AbstractResponse(405, "This username have been used!!!", false));

        User updatedUser = userService.changeName((User) authentication.getPrincipal(), request.getUsername());
        return ResponseEntity.ok().body(new AbstractResponse(200, "Username have been updated!", updatedUser.getUserResponse()));


    }


    @GetMapping("/exists/{username}")
    public ResponseEntity isUsernameExist(@PathVariable String username) {
        if (userService.isUsernameExist(username))
            return ResponseEntity.ok(new AbstractResponse(200, "This username have been used!", false));
        return ResponseEntity.ok(new AbstractResponse(200, "This username can use!", true));
    }

    @GetMapping("/avatar/default")
    public ResponseEntity getDefaultAvatars() {
        List<Avatar> avatars = avatarService.getDefaultAvatars();
        return ResponseEntity.ok(new AbstractResponse(200, "Successfully!", avatars));
    }

    @GetMapping("/bag/{id}")
    public ResponseEntity getBag(@PathVariable String id) {
        List<Item> itemList = userService.getListItem(id);
        return ResponseEntity.ok(new AbstractResponse(200, "Bag is here", itemList));
    }

    @GetMapping("/haveChangeNameCard/{id}")
    public ResponseEntity haveChangeNameCard(@PathVariable String id) {
        if (userService.haveChangeNameCard(id))
            return ResponseEntity.ok(new AbstractResponse(200, "Have Change Name Card", true));
        return ResponseEntity.ok(new AbstractResponse(200, "Have Not Change Name Card", false));
    }


}
