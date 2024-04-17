package com.fit.monopolysbapi.monopolysocketapi.request;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteMessage {
    private UserResponse sender;
    private String receiverId;
    private String roomId;
    private String roomPass;
    private InviteMessageType inviteMessageType;

    public enum InviteMessageType{
        INVITE, DECLINE
    }

    @Override
    public String toString() {
        return "InviteMessage{" +
                "sender=" + sender +
                ", receiverId='" + receiverId + '\'' +
                ", roomId='" + roomId + '\'' +
                ", roomPass='" + roomPass + '\'' +
                ", inviteMessageType=" + inviteMessageType +
                '}';
    }
}
