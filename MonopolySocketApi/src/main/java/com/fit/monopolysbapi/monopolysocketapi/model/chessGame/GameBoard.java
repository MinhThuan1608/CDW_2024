package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GameBoard {
    private Piece[][] pieces;
    public static final int COL = 8;
    public static final int ROW = 8;
    public static final int TILE_SIZE = 25;

    private int enPassantTile = -1;
    private Piece selectedPiece;
    private String turn;

    private CheckScaner checkScaner = new CheckScaner(this);

    public GameBoard(){
        this.turn = "w";
        initGame();
    }
    public Piece getPiece(int row, int col) {
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                if ((pieces[i][j] != null) && (pieces[i][j].getRow() == row) && (pieces[i][j].getCol() == col))
                    return pieces[i][j];

            }
        }
        return null;
    }

    public int getTileNum(int row, int col) {
        return row * this.ROW + col;
    }

    Piece findKing(boolean isWhite) {
        for (int i = 0; i < pieces.length; i++) {
            for (int j = 0; j < pieces.length; j++) {
                if (pieces[i][j].isWhite == isWhite && pieces[i][j].getName().substring(1).equals("k")) {
                    return pieces[i][j];
                }
            }
        }
        return null;
    }

    public void makeMove(Move move) {
        if (move.piece.getName().substring(1).equals("p")) {
            movePawn(move);
        } else if (move.piece.getName().substring(1).equals("k")){
            moveKing(move);
        }
        else {
            move.piece.row = move.newRow;
            move.piece.col = move.newCol;

//            move.piece.yPos = move.newRow * TILE_SIZE;
//            move.piece.xPos = move.newCol * TILE_SIZE;

            move.piece.isFirstMove = false;
            capture(move);
        }


    }
    private void moveKing(Move move) {
        if(Math.abs(move.piece.col - move.newCol) == 2){
            Piece rook;
            if(move.piece.col < move.newCol){
                rook = getPiece(move.piece.row, 7);
                rook.col = 5;
            }else{
                rook = getPiece(move.piece.row, 0);
                rook.col = 3;
            }
//            rook.xPos = rook.col * TILE_SIZE;
        }
    }

    private void movePawn(Move move) {
//        en Passant
        int colorIndex = move.piece.isWhite ? 1 : -1;

        if (getTileNum(move.newRow, move.newCol) == enPassantTile) {
            move.capture = getPiece(move.newRow + colorIndex, move.newCol);
        }
        if (Math.abs(move.piece.row - move.newRow) == 2) {
            enPassantTile = getTileNum(move.newRow + colorIndex, move.newCol);
        } else {
            enPassantTile = -1;
        }
//        promotion
        colorIndex = move.piece.isWhite ? 0 : 7;
        if (move.newRow == colorIndex) {
            promotionPawn(move);
        }
//
//        move.piece.row = move.newRow;
//        move.piece.col = move.newCol;
//
//        move.piece.yPos = move.newRow * tileSize;
//        move.piece.xPos = move.newCol * tileSize;
//
//        move.piece.isFirstMove = false;
//        capture(move);
    }

    private void promotionPawn(Move move) {
        pieces[move.newRow][move.newCol] = new Queen(this, move.newRow, move.newCol, move.piece.isWhite);
    }

    public void capture(Move move) {
        pieces[move.newRow][move.newCol] = null;
    }

    public boolean isValidMove(Move move) {
        if (sameTeam(move.piece, move.capture)) {
            return false;
        }
        if (!move.piece.isValidMovement(move.newRow, move.newCol)) {
            return false;
        }
        if (move.piece.moveCollidesWithPiece(move.newRow, move.newCol)) {
            return false;
        }
        if(checkScaner.isKingChecked(move)){
            return false;
        }
        return true;
    }

    public boolean sameTeam(Piece p1, Piece p2) {
        if (p1 == null || p2 == null) {
            return false;
        }
        return p1.isWhite == p2.isWhite;
    }

    public void initGame() {
        pieces = new Piece[COL][ROW];

        for (int i = 0; i < 8; i++) {
            pieces[6][i] =  new Pawn(this, 6, i, false);
            pieces[1][i] = new Pawn(this, 1, i, true);

        }

        pieces[0][0] = new Rook(this, 0, 0, true);
        pieces[0][1] = new Knight(this, 0, 1, true);
        pieces[0][2] = new Bishop(this, 0, 2, true);
        pieces[0][3] = new Queen(this, 0, 3, true);
        pieces[0][4] = new King(this, 0, 4, true);
        pieces[0][5] = new Bishop(this, 0, 5, true);
        pieces[0][6] = new Knight(this, 0, 6, true);
        pieces[0][7] = new Rook(this, 0, 7, true);


        pieces[7][0] = new Rook(this, 7, 0, false);
        pieces[7][1] = new Knight(this, 7, 1, false);
        pieces[7][2] = new Bishop(this, 7, 2, false);
        pieces[7][3] = new Queen(this, 7, 3, false);
        pieces[7][4] = new King(this, 7, 4, false);
        pieces[7][5] = new Bishop(this, 7, 5, false);
        pieces[7][6] = new Knight(this, 7, 6, false);
        pieces[7][7] = new Rook(this, 7, 7, false);

    }

    public boolean isCheckmate() {
        return true;
    }

//    public boolean validMove(int oldX, int oldY, int newX, int newY) {
////   old point == new point
//        if (oldX == newX && newY == oldY) return false;
////vượt khỏi bàn cờ
//        if (newX > 8 || newX < 0 ||
//                newY > 8 || newY < 0 ||
//                oldX > 8 || oldX < 0 ||
//                oldY > 8 || oldY < 0) return false;
//// vị trí cũ không xác định
//        if (pieces[oldX][oldY] == null) return false;
//
////        nếu không phải con tốt và
//        if (!(pieces[oldX][oldY].getName().substring(1).equals("p") &&
//                (Math.abs(newY - oldY) == 1 && Math.abs(newX - oldX) == 1 &&
//                        pieces[newX][newY].getName().substring(0, 1)
//                                .equals(pieces[oldX][oldY].getName().substring(0, 1).equals("w") ? "b" : "w"))))
//            if (!pieces[oldX][oldY].checkValidMove(oldX, oldY, newX, newY)) return false;
//// chung đội
//        if (pieces[newX][newY] != null && pieces[newX][newY].getName().substring(0, 1)
//                .equals(pieces[oldX][oldY].getName().substring(0, 1))) return false;
//
//
//        switch (pieces[oldX][oldY].getName().charAt(1)) {
//            case 'r': // con xe bị chắn không đi tiếp được khi gặp những trường hợp này
//                if (newX - oldX != 0) {
//                    for (int i = oldX; i != newX; i += (newX - oldX) / Math.abs(newX - oldX)) {
//                        if (pieces[i][newY] != null) return false;
//                    }
//                } else {
//                    for (int i = oldY; i != newY; i += (newY - oldY) / Math.abs(newY - oldY)) {
//                        if (pieces[newX][i] != null) return false;
//                    }
//                }
//
//
//
//        }
//        return false;
//    }


}
