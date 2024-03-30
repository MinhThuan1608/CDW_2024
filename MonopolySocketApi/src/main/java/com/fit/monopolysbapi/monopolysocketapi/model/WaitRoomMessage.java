package com.fit.monopolysbapi.monopolysocketapi.model;

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
    private Date createAt;
    public enum RoomMessageType{
        JOIN, LEAVE, MESSAGE, START_GAME
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
