package com.fit.monopolysbapi.monopolysocketapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "statistics")
public class Statistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int userLoginCount;
    private int matchCount;
    private int newUserCount;
    private Date logDate;
}
