package com.fit.monopolysbapi.monopolysocketapi.repository;

import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface AvatarRepository extends JpaRepository<Avatar, String> {

    @Query("select a from Avatar a where a.isDefaultAvatar = :isDefaultAvatar")
    List<Avatar> findAvatarsByDefaultAvatar(boolean isDefaultAvatar);
    Avatar findAvatarById(String id);
    boolean existsById(String id);
}
