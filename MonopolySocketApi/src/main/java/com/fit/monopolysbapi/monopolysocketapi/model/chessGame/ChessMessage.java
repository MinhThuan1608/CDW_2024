package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import lombok.*;

@Getter
@Setter
@Builder
public class ChessMessage {

    private ChessMessageType messageType;
    private Move move;
    private GameBoard gameBoard;
    private User sender;
    private boolean isCheckmate;
    private String content;

    public enum ChessMessageType {
        MOVE,
        RESIGN,
        DRAW_OFFER,
        PIECE_PROMOTION,
        CHECKMATE
    }
}

