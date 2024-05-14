package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.*;
import com.fit.monopolysbapi.monopolysocketapi.response.Hint;
import lombok.*;

import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GameBoard {
    private Piece[][] pieces;
    public static final int COL = 8;
    public static final int ROW = 8;
    public static final int TILE_SIZE = 25;
    public int resetTime;
    private int enPassantTile = -1;
    private int timer;
    private Timer countdownTimer;
    private int countdownResetCounterWhite;
    private int countdownResetCounterBlack;
    private boolean justResetCounter = false;
    private char turn;
    private Date createAt;
    private List<Move> hints;
    private CheckScanner checkScanner = new CheckScanner(this);

    @Override
    public String toString() {
        return "GameBoard{" +
                "pieces=" + Arrays.toString(pieces) +
                ", enPassantTile=" + enPassantTile +
                ", turn='" + turn + '\'' +
                ", checkScaner=" + checkScanner +
                '}';
    }

    public GameBoard(int resetTime) {
        this.createAt = new Date();
        this.turn = 'w';
        this.resetTime = resetTime;
        this.timer = resetTime;
        initGame();
        startTimer();
    }

    public void startTimer() {
        if (countdownTimer != null) {
            countdownTimer.cancel();
        }

        countdownTimer = new Timer();
        countdownTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                if (timer > 0) {
                    timer--;
                    System.out.println("Timer: " + timer);
                } else {
                    if (turn == 'w') {
                        countdownResetCounterWhite++;
                    } else {
                        countdownResetCounterBlack++;
                    }
                    justResetCounter = true;
                    if (countdownResetCounterWhite > 3) {
                        countdownTimer.cancel();
                        System.out.println("dden thang");
                    } else if (countdownResetCounterBlack > 3) {
                        countdownTimer.cancel();
                        System.out.println("trang thang");
                    } else {
                        turn = turn == 'w' ? 'b' : 'w';
                        hints = getNextStepHints(turn);
                        timer = resetTime;
                        System.out.println("Timer reset");
                        System.out.println(turn);
                    }

                }
            }
        }, 1000, 1000); // Giảm giá trị của timer mỗi giây (1000ms)
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

        this.hints = getNextStepHints(turn);
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
        return row * ROW + col;
    }

    public Piece findKing(boolean isWhite) {
        for (int i = 0; i < pieces.length; i++) {
            for (int j = 0; j < pieces.length; j++) {
                if (pieces[i][j] != null && pieces[i][j].isWhite == isWhite && pieces[i][j].getName().substring(1).equals("k")) {
                    return pieces[i][j];
                }
            }
        }
        return null;
    }

    public boolean onlyKing() {
        return this.getPieces().length == 2 && findKing(true) != null && findKing(false) != null;
    }

    public void makeMove(Move move, String namePromotion) {
        if (move.piece.getName().substring(1).equals("p")) {
            movePawn(move, namePromotion);
        } else if (move.piece.getName().substring(1).equals("k")) {
            moveKing(move);
        } else {
            pieces[move.newRow][move.newCol] = move.piece;
            move.piece.setRow(move.newRow);
            move.piece.setCol(move.newCol);

            pieces[move.oldRow][move.oldCol] = null;
            move.piece.isFirstMove = false;
        }
    }

    private void moveKing(Move move) {
        if (Math.abs(move.piece.col - move.newCol) == 2) {
            Piece rook;
            if (move.piece.col < move.newCol) {
                rook = getPiece(move.piece.row, 7);
                pieces[rook.row][7] = null;
                rook.col = 5;
            } else {
                rook = getPiece(move.piece.row, 0);
                pieces[rook.row][0] = null;
                rook.col = 3;
            }
            pieces[rook.row][rook.col] = rook;
        }
        move.piece.setRow(move.newRow);
        move.piece.setCol(move.newCol);
        pieces[move.getNewRow()][move.getNewCol()] = move.piece;
        pieces[move.getOldRow()][move.getOldCol()] = null;
    }

    private void movePawn(Move move, String namePromotion) {
        int colorIndex = move.piece.isWhite ? 1 : -1;
        if (getTileNum(move.newRow, move.newCol) == enPassantTile) {
            pieces[move.newRow - colorIndex][move.newCol] = null;
        }
        if (Math.abs(move.piece.row - move.newRow) == 2) {
            enPassantTile = getTileNum(move.newRow - colorIndex, move.newCol);
        } else {
            enPassantTile = -1;
        }
        colorIndex = move.piece.isWhite ? 7 : 0;
        if (move.newRow == colorIndex) {
            promotionPawn(move, namePromotion);
        }
        pieces[move.newRow][move.newCol] = move.piece;
        move.piece.setRow(move.newRow);
        move.piece.setCol(move.newCol);
        pieces[move.oldRow][move.oldCol] = null;

        move.piece.isFirstMove = false;
    }

    private void promotionPawn(Move move, String name) {
        switch (name) {
//            case "q":
//                move.piece = new Queen(this, move.newRow, move.newCol, move.piece.isWhite);
//                break;
            case "n":
                move.piece = new Knight(this, move.newRow, move.newCol, move.piece.isWhite);
                break;
            case "r":
                move.piece = new Rook(this, move.newRow, move.newCol, move.piece.isWhite);
                break;
            case "b":
                move.piece = new Bishop(this, move.newRow, move.newCol, move.piece.isWhite);
                break;
            default:
                move.piece = new Queen(this, move.newRow, move.newCol, move.piece.isWhite);
                break;

        }
    }

    public boolean isValidMove(Move move) {
        return hints.stream().anyMatch(m -> m.same(move));
    }

    public boolean sameTeam(Piece p1, Piece p2) {
        if (p1 == null || p2 == null) {
            return false;
        }
        return p1.isWhite == p2.isWhite;
    }

    public String[][] getPiecesResponse() {
        String[][] piecesResponse = new String[ROW][COL];
        for (int i = 0; i < ROW; i++)
            for (int j = 0; j < COL; j++)
                piecesResponse[i][j] = pieces[i][j] == null ? "" : pieces[i][j].getName();
        return piecesResponse;
    }

    public boolean hasNoStepToPlay(char nextStepColor) {
        this.hints = getNextStepHints(nextStepColor);
        return this.hints.isEmpty();
    }

    public boolean notEnoughPieceToPlay(Move move) {
        int bishopKnightCount = 0;
        for (int i = 0; i < ROW; i++) {
            for (int j = 0; j < COL; j++) {
                if (bishopKnightCount > 1) return false;
                if (i == move.getOldRow() && j == move.getOldCol()) continue;
                char piece = pieces[i][j].getName().charAt(1);
                if (i == move.getNewRow() && j == move.getNewCol()) piece = move.getPiece().getName().charAt(1);
                switch (piece) {
                    case 'k':
                        break;
                    case 'n', 'b':
                        bishopKnightCount++;
                        break;
                    default:
                        return false;
                }
            }
        }
        return true;
    }

    public List<Move> getNextStepHints(char nextStepColor) {
        List<Move> res = new ArrayList<>();
        for (Piece[] row : pieces) {
            for (Piece piece : row) {
                if (piece != null && piece.getColor() == nextStepColor) {
                    List<Move> hints = piece.getMoveHint();
                    res.addAll(hints);
                }

            }
        }
        return res;
    }

    public boolean isChecked(char teamColor) {
        Move noneMove = Move.builder().newRow(-1).newCol(-1).oldRow(-1).oldCol(-1).piece(Piece.builder().isWhite(teamColor == 'w').build()).build();
        return checkScanner.isKingChecked(noneMove);
    }

    public char getNextTurn() {
        return turn == 'w' ? 'b' : 'w';
    }

    public List<Hint> getHintsResponse() {
        return hints.stream().map(Move::toMoveResponse).toList();
    }


}
