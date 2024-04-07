package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
import lombok.*;

@Getter
@Setter

public class Move {
    int oldRow;
    int oldCol;
    int newRow;
    int newCol;

    Piece piece;
    Piece capture;

    public Move(GameBoard board, Piece piece, int newRow, int newCol) {
        this.oldRow = piece.row;
        this.oldCol = piece.col;
        this.newRow = newRow;
        this.newCol = newCol;

        this.piece = piece;
        this.capture = board.getPiece(newRow, newCol);


    }
}
