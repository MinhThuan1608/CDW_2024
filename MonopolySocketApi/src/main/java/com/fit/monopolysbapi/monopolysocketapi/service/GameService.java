package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Match;
import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.repository.MatchRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.UserRepository;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final Util util;

    public void save(User winner, User loser, Date startAt, Date endAt, long totalTime) {
        String id = util.generateId();
        while (matchRepository.existsById(id)) id = util.generateId();
        Match match = Match.builder().id(id).winner(winner).loser(loser).startAt(startAt).endAt(endAt).totalTime(totalTime).build();
        matchRepository.save(match);
    }

    public void matchEnd(Room room, User winner, User loser, boolean isWinMatch) {
        GameBoard gameBoard = room.getGameBoard();
        Date endAt = new Date(System.currentTimeMillis());
        Date startAt = gameBoard.getCreateAt();
        long totalTime = endAt.getTime() - startAt.getTime();
        if (isWinMatch && totalTime > 5 * 60 * 1000) {
            winner.setMoney(winner.getMoney() + 1000);
            winner.setExp(winner.getExp() + 2);
            loser.setMoney(loser.getMoney() + 200);
            loser.setExp(loser.getExp() + 1);
        } else if (isWinMatch) {
            winner.setMoney(winner.getMoney() + 10);
            loser.setMoney(loser.getMoney() + 10);
        } else {
            winner.setMoney(winner.getMoney() + 500);
            winner.setExp(winner.getExp() + 1);
            loser.setMoney(loser.getMoney() + 500);
            loser.setExp(loser.getExp() + 1);
        }
        userRepository.save(winner);
        userRepository.save(loser);
        save(winner, loser, startAt, endAt, totalTime);
        room.getGameBoard().getCountdownTimer().cancel();
        room.setGameBoard(null);
        room.setPlaying(false);
        room.setCreateAt(new Date());
    }
    public List<Match> getAllMatchByUserId(String userId){
        return matchRepository.findAllByWinnerIdOrLoserId(userId, userId);
    }
}
