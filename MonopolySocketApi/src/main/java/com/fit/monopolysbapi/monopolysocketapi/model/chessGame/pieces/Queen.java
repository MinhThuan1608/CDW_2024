package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Queen extends Piece {

    public Queen(GameBoard board, int row, int col, boolean isWhite) {
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wq" : "bq";
        directions = new int[][]{{-1, 0}, {1, 0}, {0, -1}, {0, 1}, {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
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

    @Override
    public List<Move> getMoveHint() {
        List<Move> hints = new ArrayList<>();
        int x, y;
        Move move;
        Piece piece;
        for (int[] direction : directions) {
            for (int i = 1; i < 8; i++) {
                x = row + i * direction[0];
                y = col + i * direction[1];
                if (x < 0 || x >= 8 || y < 0 || y >= 8) break;
                piece = board.getPiece(x, y);
                if (piece != null && piece.getColor() == this.getColor()) break;
                move = Move.builder().newRow(x).newCol(y).oldRow(row).oldCol(col).piece(this).build();
                if (!board.getCheckScanner().isKingChecked(move))
                    hints.add(move);
            }
        }
        return hints;
    }
}
