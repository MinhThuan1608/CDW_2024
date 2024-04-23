package com.fit.monopolysbapi.monopolysocketapi.model;

import com.fit.monopolysbapi.monopolysocketapi.response.FriendResponse;
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
@Table(name = "friends")
public class Friend {
    @Id
    private String id;
    @ManyToOne
    private User user1;
    @ManyToOne
    private User user2;
    private Date createAt;

    public FriendResponse toFriendResponse(String meId){
        User u = user1.getId().equals(meId)? user2: user1;
        return FriendResponse.builder().id(id).user(u.getUserResponse()).createAt(new SimpleDateFormat("dd/MM/yyyy").format(createAt)).build();
    }

}
