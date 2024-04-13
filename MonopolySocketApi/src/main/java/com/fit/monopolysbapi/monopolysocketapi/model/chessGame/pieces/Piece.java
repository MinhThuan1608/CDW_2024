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
    public List<Move> getMoveHint(){ //code below for queen, bishop and rook. other chess must be overrides
        List<Move> hints = new ArrayList<>();
        int x, y;
        Move move;
        Piece piece;
        for (int[] direction : directions) {
            for (int i = 0; i < 8; i++) {
                x = row + i * direction[0];
                y = col + i * direction[1];
                if (x < 0 || x >= 8 || y < 0 || y >= 8) break;
                piece = board.getPiece(x, y);
                if (piece != null && piece.getColor() == this.getColor()) break;
                move = Move.builder().newRow(x).newCol(y).oldRow(row).oldCol(col).piece(this).build();
                if (!board.getCheckScaner().isKingChecked(move))
                    hints.add(move);
            }
        }
        return hints;
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
