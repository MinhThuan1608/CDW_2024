package com.fit.monopolysbapi.monopolysocketapi.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AbstractResponse {
    private int code;
    private String message;
    private Object data;
}
