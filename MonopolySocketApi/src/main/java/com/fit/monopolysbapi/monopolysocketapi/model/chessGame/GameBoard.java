package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.*;
import lombok.*;
import org.springframework.security.access.method.P;

import java.util.Arrays;

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

    @Override
    public String toString() {
        return "GameBoard{" +
                "pieces=" + Arrays.toString(pieces) +
                ", enPassantTile=" + enPassantTile +
                ", selectedPiece=" + selectedPiece +
                ", turn='" + turn + '\'' +
                ", checkScaner=" + checkScaner +
                '}';
    }

    public GameBoard() {
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
            pieces = movePawn(move);
        } else if (move.piece.getName().substring(1).equals("k")) {
            moveKing(move);
        } else{
//            pieces = updatePiecePosition(move.piece,move.oldRow, move.oldCol, move.newRow, move.newCol);
            pieces[move.newRow][move.newCol] = move.piece;
            move.piece.setRow(move.newRow);
            move.piece.setCol(move.newCol);

            pieces[move.oldRow][move.oldCol] = null;
            move.piece.isFirstMove = false;
        }
    }
    public void capture(Move move) {
        pieces[move.newRow][move.newCol] = move.piece;
    }

    private void moveKing(Move move) {
        if (Math.abs(move.piece.col - move.newCol) == 2) {
            Piece rook;
            if (move.piece.col < move.newCol) {
                rook = getPiece(move.piece.row, 7);
                rook.col = 5;
            } else {
                rook = getPiece(move.piece.row, 0);
                rook.col = 3;
            }
            pieces[rook.row][rook.col] = rook;
        }
    }

    private Piece[][] movePawn(Move move) {
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
//       pieces = updatePiecePosition(move.piece, move.oldRow, move.oldCol, move.newRow, move.newCol);
        pieces[move.newRow][move.newCol] = move.piece;
        move.piece.setRow(move.newRow);
        move.piece.setCol(move.newCol);
        pieces[move.oldRow][move.oldCol] = null;

        move.piece.isFirstMove = false;
        return pieces;
    }

    private void promotionPawn(Move move) {
        pieces[move.newRow][move.newCol] = new Queen(this, move.newRow, move.newCol, move.piece.isWhite);
    }


    public boolean isValidMove(Move move) {
        if (sameTeam(move.piece, move.capture)) {
            System.out.println("same team");
            return false;
        }
        if (!move.piece.isValidMovement(move.newRow, move.newCol)) {
            System.out.println("NoValidMovement");
            return false;
        }
        if (move.piece.moveCollidesWithPiece(move.newRow, move.newCol)) {
            System.out.println("moveCollidesWithPiece");
            return false;
        }
        if(checkScaner.isKingChecked(move)){
            System.out.println("isKingChecked");
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
            pieces[6][i] = new Pawn(this, 6, i, false);
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

    public String[][] getPiecesResponse() {
        String[][] piecesResponse = new String[ROW][COL];
        for (int i = 0; i < ROW; i++)
            for (int j = 0; j < COL; j++)
                piecesResponse[i][j] = pieces[i][j] == null ? "" : pieces[i][j].getName();
        return piecesResponse;
    }



}
