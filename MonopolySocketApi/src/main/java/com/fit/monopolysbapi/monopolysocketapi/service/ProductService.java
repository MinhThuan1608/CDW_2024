package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import com.fit.monopolysbapi.monopolysocketapi.model.Product;
import com.fit.monopolysbapi.monopolysocketapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllProductIsActive() {
        return productRepository.findAllByActive(true);
    }
    public Product getProductById(String id){
        return productRepository.findProductById(id);
    }


}
