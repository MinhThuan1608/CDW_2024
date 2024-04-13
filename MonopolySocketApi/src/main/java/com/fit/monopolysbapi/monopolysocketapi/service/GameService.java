package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Match;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Queen;
import com.fit.monopolysbapi.monopolysocketapi.repository.MatchRepository;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class GameService {

    private final MatchRepository matchRepository;
    private final Util util;

    public void save(User winner, User closer, Date startAt){
        String id = util.generateId();
        while (matchRepository.existsById(id)) id = util.generateId();
        Date endAt = new Date(System.currentTimeMillis());
        Match match = Match.builder().id(id).winner(winner).closer(closer).startAt(startAt).endAt(endAt).totalTime(endAt.getTime()-startAt.getTime()).build();
        matchRepository.save(match);
    }

    public static void main(String[] args) {
        System.out.println(new Date(System.currentTimeMillis()));
    }
}
