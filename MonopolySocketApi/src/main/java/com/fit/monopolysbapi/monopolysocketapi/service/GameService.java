package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Match;
import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Queen;
import com.fit.monopolysbapi.monopolysocketapi.repository.MatchRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.UserRepository;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class GameService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final Util util;

    public void save(User winner, User closer, Date startAt, Date endAt, long totalTime) {
        String id = util.generateId();
        while (matchRepository.existsById(id)) id = util.generateId();
        Match match = Match.builder().id(id).winner(winner).closer(closer).startAt(startAt).endAt(endAt).totalTime(totalTime).build();
        matchRepository.save(match);
    }

    public void matchEnd(Room room, User winner, User closer, boolean isWinMatch) {
        GameBoard gameBoard = room.getGameBoard();
        Date endAt = new Date(System.currentTimeMillis());
        Date startAt = gameBoard.getCreateAt();
        long totalTime = endAt.getTime() - startAt.getTime();
        if (isWinMatch && totalTime > 5 * 60 * 1000) {
            winner.setMoney(winner.getMoney() + 1000);
            closer.setMoney(closer.getMoney() + 200);
        } else if (isWinMatch) {
            winner.setMoney(winner.getMoney() + 10);
            closer.setMoney(closer.getMoney() + 10);
        } else {
            winner.setMoney(winner.getMoney() + 500);
            closer.setMoney(closer.getMoney() + 500);
        }
        userRepository.save(winner);
        userRepository.save(closer);
        save(winner, closer, startAt, endAt, totalTime);
        room.setGameBoard(null);
        room.setPlaying(false);
        room.setCreateAt(new Date());
    }
}
