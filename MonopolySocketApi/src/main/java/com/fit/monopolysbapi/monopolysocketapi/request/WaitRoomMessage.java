package com.fit.monopolysbapi.monopolysocketapi.request;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WaitRoomMessage {
    private List<User> users;
    private User sender;
    private RoomMessageType messageType;
    private String content;
    private String createAt;
    private GameBoard gameBoard;
    private int timeOfTurn;
    public enum RoomMessageType{
        JOIN, LEAVE, MESSAGE, START_GAME, KICK, TIME_OUT
    }

    @Override
    public String toString() {
        return "WaitRoomMessage{" +
                "users=" + users +
                ", sender=" + sender +
                ", messageType=" + messageType +
                ", content='" + content + '\'' +
                ", createAt=" + createAt +
                '}';
    }
}
