package com.fit.monopolysbapi.monopolysocketapi.repository;

import com.fit.monopolysbapi.monopolysocketapi.model.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, String> {

    boolean existsById(String s);
    boolean existsBySenderIdAndReceiverId(String sender_id, String receiver_id);
    Optional<FriendRequest> findBySenderIdAndReceiverId(String sender_id, String receiver_id);
    Optional<FriendRequest> findById(String id);
    List<FriendRequest> findAllByReceiverId(String receiver_id);
}
