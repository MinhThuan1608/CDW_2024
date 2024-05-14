package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Item;
import com.fit.monopolysbapi.monopolysocketapi.model.Product;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.BuyItemRequest;
import com.fit.monopolysbapi.monopolysocketapi.request.DonateMessage;
import com.fit.monopolysbapi.monopolysocketapi.request.InviteMessage;
import com.fit.monopolysbapi.monopolysocketapi.request.SaleItemRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.AbstractResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.ItemService;
import com.fit.monopolysbapi.monopolysocketapi.service.ProductService;
import com.fit.monopolysbapi.monopolysocketapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ShopController {
    private final ProductService productService;
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ItemService itemService;

    @GetMapping("/shop")
    public ResponseEntity<?> getProduct() {
        List<Product> products = productService.getAllProductIsActive();
        return ResponseEntity.ok(new AbstractResponse(200, "Successfully!", products));
    }
    @PostMapping("/buyItem")
    public ResponseEntity buyItem(@RequestBody BuyItemRequest buyItemRequest, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Product product = productService.getProductById(buyItemRequest.getProductId());
        long moneyRemain = itemService.buyItem(user, product, buyItemRequest.getAmount());
        return ResponseEntity.ok(new AbstractResponse(200, "Buy Successfully!",
                moneyRemain));
    }
    @PostMapping("/saleItem")
    public ResponseEntity saleItem(@RequestBody SaleItemRequest saleItemRequest, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Item saleItem = itemService.getItemById(saleItemRequest.getItemId());
        long moneyRemain  = itemService.saleItem(user, saleItem, saleItemRequest.getSaleNumber());
        return ResponseEntity.ok(new AbstractResponse(200, "Sale Successfully!",
                moneyRemain));
    }
    @MessageMapping("/donate")
    public void donate(@Payload DonateMessage donateMessage, Message message) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        User receive = userService.getUserById(donateMessage.getReceiverId()).get();
        Item donateItem = itemService.getItemById(donateMessage.getItemId());

        itemService.donateItem(receive, donateItem, donateMessage.getAmount());

        simpMessagingTemplate.convertAndSendToUser(donateMessage.getReceiverId(), "/topic/donate",
                DonateMessage.builder()
                        .sender(user.getUserResponse())
                        .receiverId(donateMessage.getReceiverId())
                        .itemId(donateMessage.getItemId())
                        .sendProduct(donateItem.getProduct())
                        .build());

    }


}
