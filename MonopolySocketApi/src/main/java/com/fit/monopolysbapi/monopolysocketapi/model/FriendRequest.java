package com.fit.monopolysbapi.monopolysocketapi.model;

import com.fit.monopolysbapi.monopolysocketapi.response.FriendRequestResponse;
import jakarta.persistence.*;
import lombok.*;

import java.text.SimpleDateFormat;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "friend_requests")
public class FriendRequest {
    @Id
    private String id;
    @ManyToOne
    private User sender;
    @ManyToOne
    private User receiver;
    private Date createAt;

    public FriendRequestResponse toFriendRequestResponse(){
        return FriendRequestResponse.builder().id(id).sender(sender.getUserResponse()).createAt(new SimpleDateFormat("HH:mm").format(new Date())).build();
    }
}
