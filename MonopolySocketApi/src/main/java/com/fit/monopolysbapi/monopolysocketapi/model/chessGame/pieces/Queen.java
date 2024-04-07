package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import lombok.*;

@Getter
@Setter

public class Queen extends Piece {
    public Queen(GameBoard board, int row, int col, boolean isWhite) {
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wq" : "bq";
//        this.xPos = col * board.TILE_SIZE;


    }

    public boolean isValidMovement(int row, int col) {
        return row == this.row || col == this.col || Math.abs(row - this.row) == Math.abs(col - this.col);
    }

    public boolean moveCollidesWithPiece(int row, int col) {
        if (this.col == col || this.row == row) {

//        left
            if (this.col > col) {
                for (int c = this.col - 1; c > col; c--) {
                    if (board.getPiece(this.row, c) != null) {
                        return true;
                    }
                }
            }
//        right
            if (this.col < col) {
                for (int c = this.col + 1; c < col; c++) {
                    if (board.getPiece(this.row, c) != null) {
                        return true;
                    }
                }
            }
//        up
            if (this.row > row) {
                for (int r = this.row - 1; r > row; r--) {
                    if (board.getPiece(r, this.col) != null) {
                        return true;
                    }
                }
            }
//        down
            if (this.row < row) {
                for (int r = this.row + 1; r < row; r++) {
                    if (board.getPiece(r, this.col) != null) {
                        return true;
                    }
                }
            }

        } else {
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
        }
        return false;
    }
}
