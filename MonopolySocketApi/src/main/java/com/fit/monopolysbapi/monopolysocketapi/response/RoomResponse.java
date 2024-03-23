package com.fit.monopolysbapi.monopolysocketapi.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private String id;
    private String roomName;
    private int numUser;
}
