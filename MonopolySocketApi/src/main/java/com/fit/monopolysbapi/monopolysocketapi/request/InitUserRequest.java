package com.fit.monopolysbapi.monopolysocketapi.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InitUserRequest {
    private String username;
    private String defaultAvatarId;
    private String avatar;
}
