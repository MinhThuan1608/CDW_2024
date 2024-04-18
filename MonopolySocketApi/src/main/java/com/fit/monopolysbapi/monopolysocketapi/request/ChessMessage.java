package com.fit.monopolysbapi.monopolysocketapi.request;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
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
    private String turn;
    private int timer;
    private List<User> users;
    private Date createAt;

    public enum ChessMessageType {
        MOVE,
        RESIGN,
        DRAW_OFFER,
        PIECE_PROMOTION,
        CHECKMATE,
        MESSAGE,
        TIME

    }
}
