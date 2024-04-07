package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import lombok.*;

@Getter
@Setter

public class King extends Piece{
    public King(GameBoard board,int row, int col,  boolean isWhite){
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wk" : "bk";
        this.xPos = col * board.getTileSize();

    }
    public boolean isValidMovement(int row, int col) {
        return Math.abs((col - this.col) * (row - this.row)) == 1 || Math.abs((col - this.col) + (row - this.row)) == 1 || canCastle(row, col);
    }
    private boolean canCastle(int row, int col){
        if(this.row == row){
            if (col == 6){
                Piece rook = board.getPiece(row, 7);
                if(rook != null && rook.isFirstMove && isFirstMove) {
                    return board.getPiece(row, 5) == null &&
                            board.getPiece(row, 6) == null &&
                            !board.getCheckScaner().isKingChecked(new Move(board, this, row, 5 ));
                }
            }else if (col == 2){
                Piece rook = board.getPiece(row, 0);
                if(rook != null && rook.isFirstMove && isFirstMove) {
                    return board.getPiece(row, 3) == null &&
                            board.getPiece(row, 2) == null &&
                            board.getPiece(row, 1) == null &&
                            !board.getCheckScaner().isKingChecked(new Move(board, this, row, 3 ));
                }
            }
        }
        return false;
    }
}
