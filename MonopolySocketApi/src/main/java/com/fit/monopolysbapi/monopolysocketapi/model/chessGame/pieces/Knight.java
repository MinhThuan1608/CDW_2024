package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import lombok.*;

@Getter
@Setter

public class Knight extends Piece{
    public Knight(GameBoard board,int row, int col,  boolean isWhite){
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wn" : "bn";
        this.xPos = col * board.getTileSize();
    }
    public boolean isValidMovement(int row, int col){
        return Math.abs(row - this.row) * Math.abs(col - this.col) == 2;
    }
}
