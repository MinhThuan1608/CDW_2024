package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter

public class Rook extends Piece {

    public Rook(GameBoard board, int row, int col, boolean isWhite) {
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wr" : "br";
        directions = new int[][]{{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    }

    public boolean isValidMovement(int row, int col) {
        return row == this.row || col == this.col;
    }

    public boolean moveCollidesWithPiece(int row, int col) {
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
        return false;
    }

}
