package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
import lombok.*;

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
    private User sender;
    private String content;
    private String turn;

    public enum ChessMessageType {
        MOVE,
        RESIGN,
        DRAW_OFFER,
        PIECE_PROMOTION,
        CHECKMATE
    }
}

