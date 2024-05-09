package com.fit.monopolysbapi.monopolysocketapi.request;
import com.fit.monopolysbapi.monopolysocketapi.model.Product;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonateMessage {
    private UserResponse sender;
    private Product sendProduct;
    private String receiverId;
    private String itemId;
    private int amount;

}
