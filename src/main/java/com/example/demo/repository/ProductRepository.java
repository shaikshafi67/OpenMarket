package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// This interface handles all CRUD operations automatically
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Custom query to find items waiting for Admin Review
    List<Product> findByStatus(String status);
}
