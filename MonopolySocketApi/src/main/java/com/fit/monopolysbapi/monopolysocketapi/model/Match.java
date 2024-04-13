package com.fit.monopolysbapi.monopolysocketapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "matches")
public class Match {
    @Id
    private String id;
    @ManyToOne
    private User winner;
    @ManyToOne
    private User closer;
    private Date startAt;
    private Date endAt;
    private long totalTime;
}
