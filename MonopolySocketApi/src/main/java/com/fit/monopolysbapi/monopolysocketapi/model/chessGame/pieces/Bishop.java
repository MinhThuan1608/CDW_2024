package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import lombok.*;

@Getter
@Setter

public class Bishop extends Piece {
    public Bishop(GameBoard board, int row, int col, boolean isWhite) {
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wb" : "bb";
        this.xPos = col * board.getTileSize();


    }

    public boolean isValidMovement(int row, int col) {
        return Math.abs(row - this.row) == Math.abs(col - this.col);
    }

    public boolean moveCollidesWithPiece(int row, int col) {
        //        up left
        if (this.col > col && this.row < row) {
            for (int i = 1; i < Math.abs(this.col - col); i++) {
                if (board.getPiece((this.row + i), (this.col - i)) != null) {
                    return true;
                }
            }
        }
//        up right
        if (this.col < col && this.row < row) {
            for (int i = 1; i < Math.abs(this.col - col); i++) {
                if (board.getPiece((this.row + i), (this.col + i)) != null) {
                    return true;
                }
            }
        }
        //       down left
        if (this.col > col && this.row > row) {
            for (int i = 1; i < Math.abs(this.col - col); i++) {
                if (board.getPiece((this.row - i), (this.col - i)) != null) {
                    return true;
                }
            }
        }
//       down right
        if (this.col < col && this.row > row) {
            for (int i = 1; i < Math.abs(this.col - col); i++) {
                if (board.getPiece((this.row - i), (this.col + i)) != null) {
                    return true;
                }
            }
        }


        return false;
    }
}
