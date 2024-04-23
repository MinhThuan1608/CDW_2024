package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter

public class Bishop extends Piece {

    public Bishop(GameBoard board, int row, int col, boolean isWhite) {
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wb" : "bb";
        directions = new int[][]{{1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
    }

    public boolean isValidMovement(int row, int col) {
        return Math.abs(row - this.row) == Math.abs(col - this.col);
    }

    public boolean moveCollidesWithPiece(int row, int col) {
        if (this.col > col && this.row < row) {
            for (int i = 1; i < Math.abs(this.col - col); i++) {
                if (board.getPiece((this.row + i), (this.col - i)) != null) {
                    return true;
                }
            }
        }
        if (this.col < col && this.row < row) {
            for (int i = 1; i < Math.abs(this.col - col); i++) {
                if (board.getPiece((this.row + i), (this.col + i)) != null) {
                    return true;
                }
            }
        }
        if (this.col > col && this.row > row) {
            for (int i = 1; i < Math.abs(this.col - col); i++) {
                if (board.getPiece((this.row - i), (this.col - i)) != null) {
                    return true;
                }
            }
        }
        if (this.col < col && this.row > row) {
            for (int i = 1; i < Math.abs(this.col - col); i++) {
                if (board.getPiece((this.row - i), (this.col + i)) != null) {
                    return true;
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
                if (piece != null && piece.getColor() != this.getColor()) break;
            }
        }
        return hints;
    }
}
