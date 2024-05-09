package com.fit.monopolysbapi.monopolysocketapi.model.chessGame;

import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
import com.fit.monopolysbapi.monopolysocketapi.response.Hint;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Move {
    int oldRow;
    int oldCol;
    int newRow;
    int newCol;
    Piece piece;
    Piece capture;

    public Move(GameBoard board, Piece piece, int newRow, int newCol) {
        this.oldRow = piece.row;
        this.oldCol = piece.col;
        this.newRow = newRow;
        this.newCol = newCol;
        this.piece = board.getPiece(oldRow, oldCol);
        this.capture = board.getPiece(newRow, newCol);
    }

    public boolean same(Move oMove) {
        var a =1;
        return this.oldRow == oMove.oldRow && this.oldCol == oMove.oldCol && this.newRow == oMove.newRow && this.newCol == oMove.newCol && this.piece.getName().equals(oMove.piece.getName());
    }

    public Hint toMoveResponse(){
        return Hint.builder()
                .oldCol(oldCol).oldRow(oldRow).newCol(newCol).newRow(newRow).piece(piece.getName()).build();
    }

    @Override
    public String toString() {
        return "Move{" +
                "oldRow=" + oldRow +
                ", oldCol=" + oldCol +
                ", newRow=" + newRow +
                ", newCol=" + newCol +
                ", piece=" + piece.getName()+
                '}';
    }
}
