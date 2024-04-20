package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Friend;
import com.fit.monopolysbapi.monopolysocketapi.model.FriendRequest;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.repository.FriendRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.FriendRequestRepository;
import com.fit.monopolysbapi.monopolysocketapi.response.FriendRequestResponse;
import com.fit.monopolysbapi.monopolysocketapi.response.FriendResponse;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRepository friendRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final Util util;


    public boolean isFriend(User user1, User user2) {
        return friendRepository.existsByUser1IdAndUser2Id(user1.getId(), user2.getId())
                || friendRepository.existsByUser1IdAndUser2Id(user2.getId(), user1.getId());
    }

    public Optional<FriendRequest> getFriendRequest(User sender, User receiver) {
        return friendRequestRepository.findBySenderIdAndReceiverId(sender.getId(), receiver.getId());
    }

    public FriendRequest sendAddFriendRequest(User sender, User receiver) {
        String id = util.generateId();
        while (friendRequestRepository.existsById(id)) id = util.generateId();
        return friendRequestRepository.save(FriendRequest.builder().id(id).sender(sender).receiver(receiver).createAt(new Date()).build());
    }

    public void addFriend(User user1, User user2, FriendRequest friendRequest) {
        String id = util.generateId();
        while (friendRepository.existsById(id)) id = util.generateId();
        friendRequestRepository.delete(friendRequest);
        friendRepository.save(Friend.builder().id(id).user1(user1).user2(user2).createAt(new Date()).build());
    }

    public Optional<FriendRequest> getFriendRequestById(String id){
        return friendRequestRepository.findById(id);
    }

    public void removeRequest(FriendRequest friendRequest) {
        friendRequestRepository.delete(friendRequest);
    }

    public List<FriendRequestResponse> getAllRequestByReceiverId(String userId){
        return friendRequestRepository.findAllByReceiverId(userId).stream().map(FriendRequest::toFriendRequestResponse).toList();
    }

    public List<FriendResponse> getAllFriendByUserId(String userId){
        return friendRepository.findAllByUser1IdOrUser2Id(userId, userId).stream().map(f -> f.toFriendResponse(userId)).toList();
    }

    public boolean removeFriend(String user1Id, String user2Id){
        Optional<Friend> friend =  friendRepository.findByUser1IdAndUser2Id(user1Id, user2Id);
        if (friend.isEmpty()) friend =  friendRepository.findByUser1IdAndUser2Id(user2Id, user1Id);
        if (friend.isEmpty()) return false;
        friendRepository.delete(friend.get());
        return true;
    }
}
