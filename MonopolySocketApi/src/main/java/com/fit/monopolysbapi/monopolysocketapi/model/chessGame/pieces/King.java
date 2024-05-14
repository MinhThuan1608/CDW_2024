package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter

public class King extends Piece {
    public King(GameBoard board, int row, int col, boolean isWhite) {
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wk" : "bk";

//        directions = new int[][]{{-1, 0}, {1, 0}, {0, -1}, {0, 1}, {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
        directions = new int[][]{{-1, 0}, {1, 0}, {0, -1}, {0, 1}, {1, 1}, {1, -1}, {-1, 1}, {-1, -1}, {0,2}, {0,-2}};
    }

    public boolean isValidMovement(int row, int col) {
        return Math.abs((col - this.col) * (row - this.row)) == 1 || Math.abs((col - this.col) + (row - this.row)) == 1
                || canCastle(row, col);
    }

    private boolean canCastle(int row, int col) {
        if (this.row == row) {
            if (col == 6) {
                Piece rook = board.getPiece(row, 7);
                if (rook != null && rook.isFirstMove && isFirstMove) {
                    return board.getPiece(row, 5) == null &&
                            board.getPiece(row, 6) == null &&
                            !board.getCheckScanner().isKingChecked(new Move(board, this, row, 5));
                }
            } else if (col == 2) {
                Piece rook = board.getPiece(row, 0);
                if (rook != null && rook.isFirstMove && isFirstMove) {
                    return board.getPiece(row, 3) == null &&
                            board.getPiece(row, 2) == null &&
                            board.getPiece(row, 1) == null &&
                            !board.getCheckScanner().isKingChecked(new Move(board, this, row, 3));
                }
            }
        }
        return false;
    }

    public boolean moveCollidesWithPiece(int row, int col) {
        return false;
    }

    @Override
    public List<Move> getMoveHint() {
        List<Move> hints = new ArrayList<>();
        int x, y;
        Move move;
        Piece piece;
        for (int[] direction : directions) {
            x = row + direction[0];
            y = col + direction[1];
            if (x < 0 || x >= 8 || y < 0 || y >= 8) continue;
            if (Math.abs(direction[1])==2 && !canCastle(x, y)) continue;
            piece = board.getPiece(x, y);
            if (piece != null && piece.getColor() == this.getColor()) continue;
            move = Move.builder().newRow(x).newCol(y).oldRow(row).oldCol(col).piece(this).build();
            if (!board.getCheckScanner().isKingChecked(move))
                hints.add(move);
        }
        return hints;
    }
}
