package com.fit.monopolysbapi.monopolysocketapi.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Hint {
    int oldRow;
    int oldCol;
    int newRow;
    int newCol;
    String piece;
}
