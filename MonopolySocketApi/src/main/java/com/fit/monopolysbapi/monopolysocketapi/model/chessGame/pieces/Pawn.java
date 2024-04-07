package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import lombok.*;

@Getter
@Setter

public class Pawn extends Piece {

    public Pawn(GameBoard board, int row, int col, boolean isWhite) {
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wp" : "bp";
//        this.xPos = col * board.TILE_SIZE;
    }

    public boolean isValidMovement(int row, int col) {
        int colorIndex = isWhite ? 1 : -1;
//        push 1
        if (this.col == col && row == this.row + colorIndex && board.getPiece(row, col) == null){
            return true;
        }
//        push 2
        if(isFirstMove && this.col == col && row == this.row + colorIndex * 2 &&
                board.getPiece(row, col) == null && board.getPiece(row + colorIndex, col) == null){
            return true;
        }
//        capture left
        if(col == this.col - 1 && row == this.row + colorIndex && board.getPiece(row, col) != null){
            return true;
        }
//        capture right
        if(col == this.col + 1 && row == this.row + colorIndex && board.getPiece(row, col) != null){
            return true;
        }
//        en Passant left
        if(board.getTileNum(row, col) == board.getEnPassantTile() && col == this.col - 1 && row == this.row - colorIndex
                && board.getPiece(row + colorIndex, col) != null){
            return true;
        }//        en Passant right
        if(board.getTileNum(row, col) == board.getEnPassantTile() && col == this.col + 1 && row == this.row - colorIndex
                && board.getPiece(row + colorIndex, col) != null){
            return true;
        }
        return false;
    }
    public boolean moveCollidesWithPiece(int row, int col){
        // Nếu con Pawn di chuyển xuống dưới bàn cờ
        if(this.row > row){
            for (int r = this.row - 1; r > row; r--){
                if (board.getPiece(r, this.col) != null){
                    return true;
                }
            }
        }
        // Nếu con Pawn di chuyển lên trên bàn cờ
        if(this.row < row){
            for (int r = this.row + 1; r < row; r++){
                if (board.getPiece(r, this.col) != null){
                    return true;
                }
            }
        }
        return false;
    }
}
