package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import lombok.*;

@Getter
@Setter

public class Piece {
    public int col, row;

    public boolean isWhite;
    public String name;
    public int value;

    public boolean isFirstMove = true;

    GameBoard board;

    public Piece(GameBoard board){
        this.board = board;
    }
    public boolean isValidMovement(int row, int col){return true;}
    public boolean moveCollidesWithPiece(int row, int col){return true;}

    @Override
    public String toString() {
        return "Piece{" +
                "col=" + col +
                ", row=" + row +
                ", name='" + name + '\'' +
                '}';
    }
}
