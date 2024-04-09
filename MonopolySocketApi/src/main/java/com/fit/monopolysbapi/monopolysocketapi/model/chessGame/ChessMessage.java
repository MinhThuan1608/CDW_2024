package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
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
    private String turn;
    private List<User> users;

    public enum ChessMessageType {
        MOVE,
        RESIGN,
        DRAW_OFFER,
        PIECE_PROMOTION,
        CHECKMATE,
        GET_USER_IN_ROOM

    }
}

