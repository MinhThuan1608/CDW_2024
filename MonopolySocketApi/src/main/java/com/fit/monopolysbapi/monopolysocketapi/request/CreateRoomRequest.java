package com.fit.monopolysbapi.monopolysocketapi.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRoomRequest {
    private String roomName;
    private String password;
}
