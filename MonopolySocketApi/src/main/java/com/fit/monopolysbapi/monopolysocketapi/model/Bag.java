package com.fit.monopolysbapi.monopolysocketapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bag")
public class Bag {
    @Id
    private String id;
    @OneToMany
    private List<Product> product;

}
