package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.*;
import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import com.fit.monopolysbapi.monopolysocketapi.model.FriendRequest;
import com.fit.monopolysbapi.monopolysocketapi.model.Item;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.InitUserRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.AbstractResponse;
import com.fit.monopolysbapi.monopolysocketapi.response.ListUserResponseAdmin;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.AvatarService;
import com.fit.monopolysbapi.monopolysocketapi.service.GameService;
import com.fit.monopolysbapi.monopolysocketapi.service.FriendService;
import com.fit.monopolysbapi.monopolysocketapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final AvatarService avatarService;
    private final GameService gameService;
    private final FriendService friendService;
    private final SimpMessagingTemplate simpMessagingTemplate;


    @PatchMapping("/init")
    public ResponseEntity<?> initUser(@RequestBody InitUserRequest request, Authentication authentication) {
        String imageId = request.getDefaultAvatarId();
        Avatar avatar = null;
        if (userService.isUsernameExist(request.getUsername()))
            return ResponseEntity.ok(new AbstractResponse(405, "This username have been used!!!", false));

        if (imageId != null && !imageId.isEmpty()) {
            if (!avatarService.isImageDefaultExist(imageId))
                return ResponseEntity.ok(new AbstractResponse(405, "Avatar, that you provide, is not exists", false));
            avatar = avatarService.getAvatarById(imageId);
        } else if (request.getAvatar() != null) {
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
    public ResponseEntity<?> editProfileAvatar(@RequestBody InitUserRequest request, Authentication authentication) {
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
    public ResponseEntity<?> editProfileName(@RequestBody InitUserRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        if(!userService.haveChangeNameCard(user.getId()))
            return ResponseEntity.ok(new AbstractResponse(405, "User have not change name card!!!", false));
        if (userService.isUsernameExist(request.getUsername()))
            return ResponseEntity.ok(new AbstractResponse(405, "This username have been used!!!", false));
        User updatedUser = userService.changeName(user, request.getUsername());
        return ResponseEntity.ok().body(new AbstractResponse(200, "Username have been updated!", updatedUser.getUserResponse()));


    }

    @GetMapping("/me")
    public ResponseEntity<?> getUser(Authentication authentication) {
        User userAuth = (User) authentication.getPrincipal();
        User user = userService.getUserById(userAuth.getId()).get();
        UserResponse userResponse = user.getUserResponse();
        userResponse.setMoney(user.getMoney());
        userResponse.setRole(user.getRole());
        return ResponseEntity.ok(new AbstractResponse(200, "Get information successfully!", userResponse));
    }

    @GetMapping("/exists/{username}")
    public ResponseEntity<?> isUsernameExist(@PathVariable String username) {
        if (userService.isUsernameExist(username))
            return ResponseEntity.ok(new AbstractResponse(200, "This username have been used!", false));
        return ResponseEntity.ok(new AbstractResponse(200, "This username can use!", true));
    }

    @GetMapping("/avatar/default")
    public ResponseEntity<?> getDefaultAvatars() {
        List<Avatar> avatars = avatarService.getDefaultAvatars();
        return ResponseEntity.ok(new AbstractResponse(200, "Successfully!", avatars));
    }

    @PatchMapping("/search")
    public  ResponseEntity<?>  searchUsers(@RequestBody ListUserResponseAdmin listUserResponseAdmin) {
        int size = 5;
        Pageable pageable = PageRequest.of(listUserResponseAdmin.getPage(), size);
        List<UserResponse> responses = new ArrayList<>();
        List<User> users = userService.searchUsers(listUserResponseAdmin.getUsername(), pageable).getContent();
        int totalPage = userService.searchUsers(listUserResponseAdmin.getUsername(), pageable).getTotalPages();
        for (User user : users) {
            responses.add(user.getUserResponse());
        }
        listUserResponseAdmin.setUserResponse(responses);
        listUserResponseAdmin.setTotalPage(totalPage);

        return ResponseEntity.ok(new AbstractResponse(200, "List user here!", listUserResponseAdmin));
    }

    @GetMapping("/bag/{id}")
    public ResponseEntity<?> getBag(@PathVariable String id) {
        List<Item> itemList = userService.getListItem(id);
        return ResponseEntity.ok(new AbstractResponse(200, "Bag is here", itemList));
    }
    @GetMapping("/match/{id}")
    public ResponseEntity<?> getAllMatches(@PathVariable String id) {
        List<Match> matches = gameService.getAllMatchByUserId(id);
        return ResponseEntity.ok(new AbstractResponse(200, "Successfully", matches));

    }


    @GetMapping("/verify_email/{userId}")
    public ResponseEntity<?> verifyEmail(@PathVariable String userId, @RequestParam String token) throws NoSuchAlgorithmException {
        User user = null;
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) user = userOptional.get();
        else return ResponseEntity.ok(new AbstractResponse(405, "User id is wrong!", false));
        if (user.isConfirmEmail())
            return ResponseEntity.ok(new AbstractResponse(405, "This account's email have been verified", false));
        if (!userService.checkVerifyEmailToken(user, token))
            return ResponseEntity.ok(new AbstractResponse(401, "Wrong token!", false));
        userService.verifyEmail(user);
        return ResponseEntity.ok("Xác thực thành công!");
    }

    @PostMapping("/friend/request/{oUserId}")
    public ResponseEntity<?> requestAddFriend(@PathVariable String oUserId, Authentication authentication) {
        Optional<User> oUserOptional = userService.getUserById(oUserId);
        if (oUserOptional.isEmpty())
            return ResponseEntity.status(405).body(new AbstractResponse(405, "User id is wrong!", false));
        User user = (User) authentication.getPrincipal();
        User oUser = oUserOptional.get();
        if (user.getId().equals(oUserId))
            return ResponseEntity.status(405).body(new AbstractResponse(405, "You can not add friend with yourself!", false));
        if (friendService.isFriend(user, oUser))
            return ResponseEntity.status(405).body(new AbstractResponse(405, "Both users are friends!", false));
        Optional<FriendRequest> friendRequestOptional = friendService.getFriendRequest(user, oUser);
        if (friendRequestOptional.isPresent())
            return ResponseEntity.ok(new AbstractResponse(405, "You are requested!", "RE_REQUEST"));
        friendRequestOptional = friendService.getFriendRequest(oUser, user);
        if (friendRequestOptional.isPresent()) {
            friendService.addFriend(oUser, user, friendRequestOptional.get());
            return ResponseEntity.ok(new AbstractResponse(200, "Add friend successfully!", "ADDED"));
        }
        FriendRequest friendRequest = friendService.sendAddFriendRequest(user, oUser);
        simpMessagingTemplate.convertAndSendToUser(oUserId, "/topic/friend/request", friendRequest.toFriendRequestResponse());
        return ResponseEntity.ok(new AbstractResponse(200, "Send request successfully!", "REQUESTED"));
    }

    @PostMapping("/friend/add/{idRequest}")
    public ResponseEntity<?> addFriend(@PathVariable String idRequest, Authentication authentication){
        Optional<FriendRequest> friendRequestOptional = friendService.getFriendRequestById(idRequest);
        if (friendRequestOptional.isEmpty())
            return ResponseEntity.status(405).body(new AbstractResponse(405, "Your request id is wrong!", false));
        FriendRequest friendRequest = friendRequestOptional.get();
        User user = (User) authentication.getPrincipal();
        if (!friendRequest.getReceiver().getId().equals(user.getId()))
            return ResponseEntity.status(405).body(new AbstractResponse(405, "You not have this request!", false));
        simpMessagingTemplate.convertAndSendToUser(friendRequest.getSender().getId(), "/topic/friend/add", friendRequest.getReceiver().getUsername());
        friendService.addFriend(friendRequest.getSender(), friendRequest.getReceiver(), friendRequest);
        return ResponseEntity.ok(new AbstractResponse(200, "Add friend successfully!", "ADDED"));
    }

    @DeleteMapping("/friend/request/remove/{idRequest}")
    public ResponseEntity<?> removeRequestFriend(@PathVariable String idRequest, Authentication authentication){
        Optional<FriendRequest> friendRequestOptional = friendService.getFriendRequestById(idRequest);
        if (friendRequestOptional.isEmpty())
            return ResponseEntity.status(405).body(new AbstractResponse(405, "Your request id is wrong!", false));
        FriendRequest friendRequest = friendRequestOptional.get();
        User user = (User) authentication.getPrincipal();
        if (!friendRequest.getReceiver().getId().equals(user.getId()))
            return ResponseEntity.status(405).body(new AbstractResponse(405, "You not have this request!", false));
        friendService.removeRequest(friendRequest);
        return ResponseEntity.ok(new AbstractResponse(200, "Remove add friend request successfully!", true));
    }

    @GetMapping("/friend/request")
    public ResponseEntity<?> getFriendRequest(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(new AbstractResponse(200, "Get friend request successfully!", friendService.getAllRequestByReceiverId(user.getId())));
    }

    @GetMapping("/friend")
    public ResponseEntity<?> getFriends(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(new AbstractResponse(200, "Get friends successfully!", friendService.getAllFriendByUserId(user.getId())));
    }

    @DeleteMapping ("/friend/remove/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable String friendId, Authentication authentication){
        User user = (User) authentication.getPrincipal();
        boolean deleteResult = friendService.removeFriend(user.getId(), friendId);
        if (!deleteResult)
            return ResponseEntity.status(405).body(new AbstractResponse(405, "You not have that friend!", false));
        return ResponseEntity.ok(new AbstractResponse(200, "Remove friend successfully!", true));

    }

    @GetMapping("/search/{username}")
    public ResponseEntity<?> searchUser(@PathVariable String username){
        Optional<User> userSearchOptional = userService.getUserByUsername(username);
        if (userSearchOptional.isEmpty())
            return ResponseEntity.status(405).body(new AbstractResponse(405, "Username is wrong!", null));
        return ResponseEntity.ok(new AbstractResponse(200, "Get info successfully!", userSearchOptional.get().getUserResponse()));
    }

}
