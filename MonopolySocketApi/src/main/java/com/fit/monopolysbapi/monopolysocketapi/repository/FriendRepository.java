package com.fit.monopolysbapi.monopolysocketapi.repository;

import com.fit.monopolysbapi.monopolysocketapi.model.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, String> {

    boolean existsByUser1IdAndUser2Id(String user1_id, String user2_id);
    boolean existsById(String id);
    List<Friend> findAllByUser1IdOrUser2Id(String user1_id, String user2_id);
    Optional<Friend> findByUser1IdAndUser2Id(String user1_id, String user2_id);
}
