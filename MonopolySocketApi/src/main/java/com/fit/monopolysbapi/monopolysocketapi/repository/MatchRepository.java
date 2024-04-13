package com.fit.monopolysbapi.monopolysocketapi.repository;

import com.fit.monopolysbapi.monopolysocketapi.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, String> {
}
