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
}
