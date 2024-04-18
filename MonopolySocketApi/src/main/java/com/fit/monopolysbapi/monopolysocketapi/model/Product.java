package com.fit.monopolysbapi.monopolysocketapi.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private String urlImage;
    private int quantity;
    private boolean isActive;
}
