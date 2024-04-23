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


    public long buyItem(User user, Product product, int amount) {
        long checkout = product.getPrice() * amount;
        if (user.getMoney() >= checkout) {
            user.setMoney(user.getMoney() - checkout);
            userRepository.save(user);
            Item item = itemRepository.findItemByUserIdAndProductId(user.getId(), product.getId());
            if (item == null) {
                String itemId = util.generateId();
                while (itemRepository.existsById(itemId))
                    itemId = util.generateId();

                itemRepository.save(Item.builder().id(itemId).user(user).product(product).quantity(amount).build());
            } else {
                item.setQuantity(item.getQuantity() + amount);
                itemRepository.save(item);
            }
        }
        return user.getMoney();
    }

    public long saleItem(User user, Item item, int amount) {
        if (item.getProduct().isSaleAble()) {
            int remainNumber = item.getQuantity() - amount;
            if (remainNumber > 0) {
                item.setQuantity(remainNumber);
                itemRepository.save(item);
            } else {
                itemRepository.delete(item);
            }
            user.setMoney((long) (user.getMoney() + (item.getProduct().getPrice() * 0.05 * amount)));
            userRepository.save(user);
        }
        return user.getMoney();
    }

    public void donateItem(User receive, Item item, int amount) {
        if (item.getProduct().isDonateAble()) {
//            xử lý bên ng tặng
            int remainNumber = item.getQuantity() - amount;
            if (remainNumber > 0) {
//            set lại số lượng sau khi tặng
                item.setQuantity(remainNumber);
                itemRepository.save(item);
//                neu có 1 mà tag 1 thfi xoa item mơi tặng đi
            } else {
                itemRepository.delete(item);
            }
//            xử lý ở ng nhận
//            nếu người nhaanj cos sp đó ròi thì them slog
            Item receiveItem = itemRepository.findItemByUserIdAndProductId(receive.getId(), item.getProduct().getId());
            if (receiveItem == null) {
                String itemId = util.generateId();
                while (itemRepository.existsById(itemId))
                    itemId = util.generateId();
                itemRepository.save(Item.builder().id(itemId).user(receive)
                        .product(item.getProduct()).quantity(amount).build());
            } else {
                receiveItem.setQuantity(receiveItem.getQuantity() + amount);
                itemRepository.save(receiveItem);
            }
//        return true;
        }
//        return false;
    }
}
