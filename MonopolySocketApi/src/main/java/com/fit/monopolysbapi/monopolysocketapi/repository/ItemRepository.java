package com.fit.monopolysbapi.monopolysocketapi.repository;

import com.fit.monopolysbapi.monopolysocketapi.model.Item;
import com.fit.monopolysbapi.monopolysocketapi.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, String> {
    Item findItemById(String id);
    Item findItemByProductId(String id);
    List<Item> findAllByProductIdAndUserId(String product_id, String user_id);
    List<Item> findAllByUserId(String user_id);
    Item findItemByUserIdAndProductId(String user_id, String product_id);
    boolean existsById(String id);

}
