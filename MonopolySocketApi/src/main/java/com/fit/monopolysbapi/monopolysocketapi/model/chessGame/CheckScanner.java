package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;

import java.util.Arrays;

public class CheckScanner {
    GameBoard board;

    public CheckScanner(GameBoard board) {
        this.board = board;
    }

    public boolean isKingChecked(Move move) {
        Piece king = board.findKing(move.piece.isWhite);
        if(king == null) return false;
        int kingRow = king.row;
        int kingCol = king.col;
        if (move.piece.name != null && move.piece.name.substring(1).equals("k")) {
            kingRow = move.newRow;
            kingCol = move.newCol;
        }

        return hitByRook(move, king, kingRow, kingCol) ||
                hitByBishop(move, king, kingRow, kingCol) ||
                hitByKnight(move, king, kingRow, kingCol) ||
                hitByPawn(move, king, kingRow, kingCol) ||
                hitByKing(king, kingRow, kingCol);
    }

    private boolean hitByRook(Move move, Piece king, int kingRow, int kingCol) {
        String[] attackers = {"r", "q"};
        return checkHitInLine(move, king, kingRow, kingCol, 0, 1, attackers) ||
                checkHitInLine(move, king, kingRow, kingCol, 1, 0, attackers) ||
                checkHitInLine(move, king, kingRow, kingCol, 0, -1, attackers) ||
                checkHitInLine(move, king, kingRow, kingCol, -1, 0, attackers);
    }

    private boolean hitByBishop(Move move, Piece king, int kingRow, int kingCol) {
        String[] attackers = {"b", "q"};
        return checkHitInLine(move, king, kingRow, kingCol, -1, -1, attackers) ||
                checkHitInLine(move, king, kingRow, kingCol, 1, -1, attackers) ||
                checkHitInLine(move, king, kingRow, kingCol, -1, 1, attackers) ||
                checkHitInLine(move, king, kingRow, kingCol, 1, 1, attackers);
    }

    private boolean checkHitInLine(Move move, Piece king, int kingRow, int kingCol, int rowVal, int colVal, String... attackers) {
        for (int i = 1; i < 8; i++) {
            if ((kingCol + (i * colVal) == move.newCol && kingRow + (i * rowVal) == move.newRow) ||
                    kingCol + (i * colVal) >= 8 || kingRow + (i * rowVal) >= 8 ||
                    kingCol + (i * colVal) < 0 || kingRow + (i * rowVal) < 0) break;
            if (kingCol + (i * colVal) == move.oldCol && kingRow + (i * rowVal) == move.oldRow) continue;
            Piece piece = board.getPiece(kingRow + (i * rowVal), kingCol + (i * colVal));
            if (piece != null) {
                if (!board.sameTeam(piece, king) && Arrays.stream(attackers).anyMatch(a -> a.equals(piece.name.substring(1)))) {
                    return true;
                }
                break;
            }
        }
        return false;
    }

    private boolean hitByKnight(Move move, Piece king, int kingRow, int kingCol) {
        int row = move.newRow, col = move.newCol;
        return checkKnight(board.getPiece(kingRow - 2, kingCol - 1), king, row, col) ||
                checkKnight(board.getPiece(kingRow - 2, kingCol + 1), king, row, col) ||
                checkKnight(board.getPiece(kingRow - 1, kingCol + 2), king, row, col) ||
                checkKnight(board.getPiece(kingRow + 1, kingCol + 2), king, row, col) ||
                checkKnight(board.getPiece(kingRow + 2, kingCol + 1), king, row, col) ||
                checkKnight(board.getPiece(kingRow + 2, kingCol - 1), king, row, col) ||
                checkKnight(board.getPiece(kingRow + 1, kingCol - 2), king, row, col) ||
                checkKnight(board.getPiece(kingRow - 1, kingCol - 2), king, row, col);

    }

    private boolean checkKnight(Piece p, Piece king, int row, int col) {
        return p != null && !board.sameTeam(p, king) && p.name.substring(1).equals("n") && !(p.col == col && p.row == row);
    }

    private boolean hitByKing(Piece king, int kingRow, int kingCol) {

        return checkKing(board.getPiece(kingRow - 1, kingCol - 1), king) ||
                checkKing(board.getPiece(kingRow - 1, kingCol + 1), king) ||
                checkKing(board.getPiece(kingRow + 1, kingCol - 1), king) ||
                checkKing(board.getPiece(kingRow + 1, kingCol + 1), king) ||

                checkKing(board.getPiece(kingRow - 1, kingCol), king) ||
                checkKing(board.getPiece(kingRow, kingCol - 1), king) ||
                checkKing(board.getPiece(kingRow, kingCol + 1), king) ||
                checkKing(board.getPiece(kingRow + 1, kingCol), king);
    }

    private boolean checkKing(Piece thatKing, Piece thisKing) {
        return thatKing != null && !board.sameTeam(thisKing, thatKing) && thatKing.name.substring(1).equals("k");
    }

    private boolean hitByPawn(Move move, Piece king, int kingRow, int kingCol) {
        int colorVal = king.isWhite ? 1 : -1;
        return checkPawn(board.getPiece(kingRow + colorVal, kingCol + 1), king, move.newRow, move.newCol) ||
                checkPawn(board.getPiece(kingRow + colorVal, kingCol - 1), king, move.newRow, move.newCol);
    }

    private boolean checkPawn(Piece p, Piece k, int row, int col) {
        return p != null && !board.sameTeam(p, k) && p.name.substring(1).equals("p") && p.col != col && p.row != row;
    }
}
