package com.fit.monopolysbapi.monopolysocketapi.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameBoard {
    private Piece[][] pieces;

    public void initGame() {
        pieces = new Piece[8][8];

        pieces[0][0].setName("wr");
        pieces[0][1].setName("wn");
        pieces[0][2].setName("wb");
        pieces[0][3].setName("wq");
        pieces[0][4].setName("wk");
        pieces[0][5].setName("wb");
        pieces[0][6].setName("wn");
        pieces[0][7].setName("wr");

        pieces[7][0].setName("br");
        pieces[7][1].setName("bn");
        pieces[7][2].setName("bb");
        pieces[7][3].setName("bq");
        pieces[7][4].setName("bk");
        pieces[7][5].setName("bb");
        pieces[7][6].setName("bn");
        pieces[7][7].setName("br");
    }

    public boolean validMove(int oldX, int oldY, int newX, int newY) {

        if (oldX == newX && newY == oldY) return false;
        if (newX > 8 || newX < 0 ||
                newY > 8 || newY < 0 ||
                oldX > 8 || oldX < 0 ||
                oldY > 8 || oldY < 0) return false;
        if (pieces[oldX][oldY] == null) return false;
        if (!(pieces[oldX][oldY].getName().substring(1).equals("p") &&
                (Math.abs(newY - oldY) == 1 && Math.abs(newX - oldX) == 1 &&
                        pieces[newX][newY].getName().substring(0, 1)
                                .equals(pieces[oldX][oldY].getName().substring(0, 1).equals("w") ? "b" : "w"))))
            if (!pieces[oldX][oldY].checkValidMove(oldX, oldY, newX, newY)) return false;

        if(pieces[newX][newY] != null && pieces[newX][newY].getName().substring(0,1)
                .equals(pieces[oldX][oldY].getName().substring(0,1))) return false;
        switch (pieces[oldX][oldY].getName().charAt(1)){
            case 'r': // con xe bi chan ko di duoc khi gap nhung con nay
                if(newX - oldX != 0){
                    for (int i = oldX; i != newX; i+= (newX - oldX)/Math.abs(newX - oldX)) {
                        if(pieces[i][newY] != null) return false;
                    }
                }else {
                    for (int i = oldY; i != newY; i+= (newY - oldY)/Math.abs(newY - oldY)) {
                        if(pieces[newX][i] != null) return false;
                    }
                }


        }
        return false;
    }

}
