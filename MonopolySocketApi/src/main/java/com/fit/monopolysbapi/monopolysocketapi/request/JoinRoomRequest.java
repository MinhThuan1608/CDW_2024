package com.fit.monopolysbapi.monopolysocketapi.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinRoomRequest {
    private String roomId;
    private String password;

    @Override
    public String toString() {
        return "JoinRoomRequest{" +
                "roomId='" + roomId + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
