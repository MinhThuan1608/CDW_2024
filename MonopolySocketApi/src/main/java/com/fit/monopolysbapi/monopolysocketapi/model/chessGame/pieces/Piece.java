package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Piece {
    public int col, row;
    public boolean isWhite;
    public String name;
    public boolean isFirstMove = true;
    GameBoard board;
    protected int[][] directions;

    public Piece(GameBoard board){
        this.board = board;
    }
    public boolean isValidMovement(int row, int col){return true;}
    public boolean moveCollidesWithPiece(int row, int col){return true;}
    public List<Move> getMoveHint(){
        return new ArrayList<>();
    }

    public char getColor(){
        return getName().charAt(0);
    }

    @Override
    public String toString() {
        return "Piece{" +
                "col=" + col +
                ", row=" + row +
                ", name='" + name + '\'' +
                '}';
    }
}
