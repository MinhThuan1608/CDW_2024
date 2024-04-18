package com.fit.monopolysbapi.monopolysocketapi.repository;

import com.fit.monopolysbapi.monopolysocketapi.model.Bag;
import com.fit.monopolysbapi.monopolysocketapi.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BagRepository extends JpaRepository<Bag, String> {
    Bag findBagById(String id);



}
