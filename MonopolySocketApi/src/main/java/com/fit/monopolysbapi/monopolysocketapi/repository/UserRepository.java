package com.fit.monopolysbapi.monopolysocketapi.repository;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    boolean existsById(String id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.username = :identifier or u.email = :identifier")
    Optional<User> findByUsernameOrEmail(String identifier);
    int countUserByLastLoginDateBetween(Date lastLoginDate, Date lastLoginDate2);
    int countByCreateDateBetween(Date from, Date to);

}
