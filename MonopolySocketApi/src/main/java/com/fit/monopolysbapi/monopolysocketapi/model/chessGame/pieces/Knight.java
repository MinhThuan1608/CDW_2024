package com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter

public class Knight extends Piece {
    public Knight(GameBoard board, int row, int col, boolean isWhite) {
        super(board);
        this.row = row;
        this.col = col;
        this.isWhite = isWhite;
        this.name = isWhite ? "wn" : "bn";
        directions = new int[][]{{-2, -1}, {-2, 1}, {-1, -2}, {-1, 2}, {1, -2}, {1, 2}, {2, -1}, {2, 1}};
    }

    public boolean isValidMovement(int row, int col) {
        return Math.abs(row - this.row) * Math.abs(col - this.col) == 2;
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
            piece = board.getPiece(x, y);
            if (piece != null && piece.getColor() == this.getColor()) continue;
            move = Move.builder().newRow(x).newCol(y).oldRow(row).oldCol(col).piece(this).build();
            if (!board.getCheckScanner().isKingChecked(move))
                hints.add(move);
        }
        return hints;
    }
}
