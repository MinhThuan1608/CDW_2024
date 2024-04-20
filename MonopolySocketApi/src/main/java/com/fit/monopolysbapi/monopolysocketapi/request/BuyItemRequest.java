package com.fit.monopolysbapi.monopolysocketapi.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyItemRequest {
    private String productId;
}
