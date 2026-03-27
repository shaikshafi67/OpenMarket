package com.example.demo.service;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    // Logic to save a new product (starts as PENDING)
    public void saveProduct(Product product) {
        product.setStatus("PENDING");
        repository.save(product);
    }

    // Logic for Admin to see only products waiting for review
    public List<Product> getPendingProducts() {
        return repository.findByStatus("PENDING");
    }

    // Logic for Admin to Approve a product
    public void approveProduct(Long id) {
        Product p = repository.findById(id).orElse(null);
        if (p != null) {
            p.setStatus("APPROVED"); // Change status to Approved
            repository.save(p);
        }
    }
}
