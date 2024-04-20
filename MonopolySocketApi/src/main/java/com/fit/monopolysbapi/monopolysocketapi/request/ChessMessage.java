package com.fit.monopolysbapi.monopolysocketapi.request;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
import com.fit.monopolysbapi.monopolysocketapi.response.Hint;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChessMessage {

    private ChessMessageType messageType;
    private Move move;
    private String[][] pieces;
    private boolean isWin;
    private String namePromotion;
    private User sender;
    private String content;
    private int timer;
    private List<User> users;
    private Date createAt;
    private char turn;
    private String winnerId;
    private List<Hint> hints;


    public enum ChessMessageType {
        CONNECT,
        MOVE,
        MESSAGE,
        GIVE_UP,
        EXIT,
        WIN,
        DRAW,
        TIME

    }
}

