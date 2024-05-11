package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Product;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.BuyItemRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.AbstractResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.ItemService;
import com.fit.monopolysbapi.monopolysocketapi.service.ProductService;
import com.fit.monopolysbapi.monopolysocketapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ShopController {
    private final ProductService productService;
    private final UserService userService;
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
        boolean buyResult = itemService.buyItem(user, product);
        return ResponseEntity.ok(new AbstractResponse(200, "Successfully!",
                buyResult));
    }


}
