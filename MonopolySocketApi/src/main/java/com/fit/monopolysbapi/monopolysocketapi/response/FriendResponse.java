package com.fit.monopolysbapi.monopolysocketapi.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendResponse {
    private String id;
    private UserResponse user;
    private String createAt;
}
