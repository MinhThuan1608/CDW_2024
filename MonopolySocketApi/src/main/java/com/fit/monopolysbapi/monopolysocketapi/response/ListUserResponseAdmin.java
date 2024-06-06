package com.fit.monopolysbapi.monopolysocketapi.response;

import com.fit.monopolysbapi.monopolysocketapi.model.Match;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListUserResponseAdmin {
    private List<UserResponse> userResponse;
    private List<Match> matches;
    private int totalPage;
    private int page;
    private String username;
    private String id;
}
