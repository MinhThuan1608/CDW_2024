package com.fit.monopolysbapi.monopolysocketapi.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItemRequest {
    private String itemId;
    private int saleNumber;
}
