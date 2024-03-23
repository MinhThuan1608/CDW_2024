package com.fit.monopolysbapi.monopolysocketapi.response;

import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import com.fit.monopolysbapi.monopolysocketapi.model.Role;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String username;
    private Avatar avatar;
    private boolean isConfirmEmail;
    private boolean isNonLocked;
    private Role role;
    private String token;
}
