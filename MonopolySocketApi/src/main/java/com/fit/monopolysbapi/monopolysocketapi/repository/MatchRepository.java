package com.fit.monopolysbapi.monopolysocketapi.repository;

import com.fit.monopolysbapi.monopolysocketapi.model.Match;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, String> {
    List<Match> findAllByWinnerIdOrLoserId(String winner_id, String loser_id);
    Page<Match> findAll(Pageable pageable);
    int countMatchByStartAtBetween(Date from, Date to);
}
