package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Item;
import com.fit.monopolysbapi.monopolysocketapi.model.Product;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.repository.ItemRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.ProductRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.UserRepository;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final Util util;

    public Item getItemById(String itemId) {
        return itemRepository.findItemById(itemId);
    }


    public boolean buyItem(User user, Product product) {
        if (user.getMoney() >= product.getPrice()) {
            user.setMoney(user.getMoney() - product.getPrice());
            userRepository.save(user);
            Item item = itemRepository.findItemByUserIdAndProductId(user.getId(), product.getId());
            if (item == null) {
                String itemId = util.generateId();
                while (itemRepository.existsById(itemId))
                    itemId = util.generateId();

                itemRepository.save(Item.builder().id(itemId).user(user).product(product).quantity(1).build());
            } else {
                item.setQuantity(item.getQuantity() + 1);
                itemRepository.save(item);
            }
            return true;
        }
        return false;
    }
}
