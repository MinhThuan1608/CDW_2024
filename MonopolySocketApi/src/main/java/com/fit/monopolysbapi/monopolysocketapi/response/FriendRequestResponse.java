package com.fit.monopolysbapi.monopolysocketapi.response;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendRequestResponse {
    private String id;
    private UserResponse sender;
    private String createAt;
}
