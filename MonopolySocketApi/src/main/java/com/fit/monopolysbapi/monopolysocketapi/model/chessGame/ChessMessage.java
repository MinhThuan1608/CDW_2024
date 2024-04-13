package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import lombok.*;

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
    private boolean isCheckmate;
    private String namePromotion;
    private User sender;
    private String content;
    private char turn;
    private List<User> users;
    private String winnerId;

    public enum ChessMessageType {
        CONNECT,
        MOVE,
        GIVE_UP,
        GET_USER_IN_ROOM,
        WIN,
        DRAW

    }
}

