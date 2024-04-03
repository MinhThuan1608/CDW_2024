package com.fit.monopolysbapi.monopolysocketapi.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Piece {
    private String name;

    public boolean checkValidMove(int oldX, int oldY, int newX, int newY){

        switch (name.substring(1)) {
            case "r": //  con xe
                if(newX - oldX == 0 || newY - oldY == 0) return true;
            case "n": // con ngua
                if((Math.abs(newX - oldX) == 2 && Math.abs(newY - oldY) == 1) ||
                        (Math.abs(newX - oldX) == 1 && Math.abs(newY - oldY) == 2) ) return true;
            case "k":   // con vua
                if(((newX - oldX == 0 && Math.abs(newY - newX) == 1)|| (newY - oldY == 0 && Math.abs(newX - oldX) == 1)) ||
                        (Math.abs(newX - oldX) == Math.abs(newY - oldY) && Math.abs(newY - oldY) == 1)) return true;
            case "q": // con queen
                if((newX - oldX == 0 || newY - oldY == 0) ||
                        (Math.abs(newX - oldX) == Math.abs(newY - oldY))) return true;
            case "p":    // con tot
//                if(Math.abs(newY - oldY) == 1 && Math.abs(newX - oldX) == 1)
                if((name.substring(0,1).equals("b") && oldY == 6) || (name.substring(0,1).equals("w") && oldY == 1)) {
                    if (Math.abs(newY - oldY) < 3 && newX - oldX == 0) return true;
                }else{
                    return (Math.abs(newY - oldY) == 1 && newX - oldX == 0);
                }
            case "b":    // con tuong
                if((Math.abs(newX - oldX) == Math.abs(newY - oldY)) ) return true;
        }
        return false;
    }


}
