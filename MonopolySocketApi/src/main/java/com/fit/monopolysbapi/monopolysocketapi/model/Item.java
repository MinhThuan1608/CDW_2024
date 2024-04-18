package com.fit.monopolysbapi.monopolysocketapi.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.repository.JpaRepository;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "item")
public class Item{
    @Id
    private String id;
    @ManyToOne
    private User user;
    @ManyToOne
    private Product product;
    private int quantity;

    @Override
    public String toString() {
        return "Item{" +
                "id='" + id + '\'' +
                ", product=" + product +
                '}';
    }
}
