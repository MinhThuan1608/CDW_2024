package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;

public class CheckScaner {
    GameBoard board;
    public CheckScaner(GameBoard board){
        this.board = board;
    }
    public boolean isKingChecked(Move move){
        Piece king = board.findKing(move.piece.isWhite);
        assert king != null;

        int kingRow = king.row;
        int kingCol = king.col;

        if(board.getSelectedPiece() != null && board.getSelectedPiece().getName().substring(1).equals("k")){
            kingRow = move.newRow;
            kingCol = move.newCol;
        }
        return hitByRook(move.newRow, move.newCol, king, kingRow, kingCol, 0, 1) || // up
                hitByRook(move.newRow, move.newCol, king, kingRow, kingCol, 1, 0) || // right
                hitByRook(move.newRow, move.newCol, king, kingRow, kingCol, 0, -1) || // down
                hitByRook(move.newRow, move.newCol, king, kingRow, kingCol, -1, 0) || // left

                hitByBishop(move.newRow, move.newCol, king, kingRow, kingCol, -1, -1) ||
                hitByBishop(move.newRow, move.newCol, king, kingRow, kingCol, 1, -1) ||
                hitByBishop(move.newRow, move.newCol, king, kingRow, kingCol, -1, 1) ||
                hitByBishop(move.newRow, move.newCol, king, kingRow, kingCol, 1, 1) ||

                hitByKnight(move.newRow, move.newCol, king, kingRow, kingCol) ||
                hitByPawn(move.newRow, move.newCol, king, kingRow, kingCol) ||
                hitByKing(king, kingRow, kingCol);
    }
    private boolean hitByRook(int row, int col, Piece king, int kingRow, int kingCol, int rowVal, int colVal){
        for (int i = 0; i < 8; i++) {
            if (kingCol + (i * colVal) == col && kingRow + (i* rowVal) == row){
                break;
            }
            Piece piece = board.getPiece(kingRow + (i*rowVal), kingCol + (i*colVal));
            if (piece != null && piece != board.getSelectedPiece()) {
                if(!board.sameTeam(piece, king) && (piece.name.substring(1).equals("r") || piece.name.substring(1).equals("q"))){
                    return true;
                }
                break;
            }
        }
        return false;
    }
    private boolean hitByBishop(int row, int col, Piece king, int kingRow, int kingCol, int rowVal, int colVal){
        for (int i = 0; i < 8; i++) {
            if (kingCol - (i * colVal) == col && kingRow - (i* rowVal) == row){
                break;
            }
            Piece piece = board.getPiece(kingRow - (i*rowVal), kingCol - (i*colVal));
            if (piece != null && piece != board.getSelectedPiece()) {
                if(!board.sameTeam(piece, king) && (piece.name.substring(1).equals("b") || piece.name.substring(1).equals("q"))){
                    return true;
                }
                break;
            }
        }
        return false;
    }
    private boolean hitByKnight(int row, int col, Piece king, int kingRow, int kingCol){
        return checkKnight(board.getPiece(kingRow - 2, kingCol - 1), king, row, col) ||
                checkKnight(board.getPiece(kingRow - 2, kingCol + 1), king, row, col) ||
                checkKnight(board.getPiece(kingRow - 1, kingCol + 2), king, row, col) ||
                checkKnight(board.getPiece(kingRow + 1, kingCol + 2), king, row, col) ||
                checkKnight(board.getPiece(kingRow + 2, kingCol + 1), king, row, col) ||
                checkKnight(board.getPiece(kingRow + 2, kingCol - 1), king, row, col) ||
                checkKnight(board.getPiece(kingRow + 1, kingCol - 2), king, row, col) ||
                checkKnight(board.getPiece(kingRow - 1, kingCol - 2), king, row, col);

    }
    private boolean checkKnight(Piece p, Piece k, int row, int col){
        return p != null && !board.sameTeam(p, k) && p.name.substring(1).equals("k") && !(p.col == col || p.row == row);
    }
    private boolean hitByKing(Piece king, int kingRow, int kingCol){
        return checkKing(board.getPiece(kingRow - 1, kingCol -1), king) ||
                checkKing(board.getPiece(kingRow - 1, kingCol +1), king) ||
                checkKing(board.getPiece(kingRow - 1, kingCol), king) ||
                checkKing(board.getPiece(kingRow, kingCol -1), king) ||
                checkKing(board.getPiece(kingRow, kingCol +1), king) ||
                checkKing(board.getPiece(kingRow + 1, kingCol -1), king) ||
                checkKing(board.getPiece(kingRow + 1, kingCol +1), king) ||
                checkKing(board.getPiece(kingRow + 1, kingCol), king);
    }
    private boolean checkKing(Piece k, Piece p){
        return p != null && !board.sameTeam(p, k) && p.name.substring(1).equals("k");
    }
    private boolean hitByPawn(int row, int col, Piece king, int kingRow, int kingCol){
        int colorVal = king.isWhite ? -1 : 1;
        return checkPawn(board.getPiece(kingRow + colorVal, kingCol + 1), king, row, col) ||
                checkPawn(board.getPiece(kingRow + colorVal, kingCol -1), king, row, col);
    }
    private boolean checkPawn(Piece p, Piece k, int row, int col){
        return p != null && !board.sameTeam(p, k) && p.name.substring(1).equals("p");
    }
}
