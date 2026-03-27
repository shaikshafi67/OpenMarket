package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ProductController {

    @Autowired
    private ProductService service;

    // 1. Show the "Sell Item" Form
    @GetMapping("/sell")
    public String showUploadForm() {
        return "add-product"; // Looks for add-product.html
    }

    // 2. Save the Product (Set to PENDING by Service)
    @PostMapping("/products/save")
    public String saveProduct(@ModelAttribute Product product) {
        service.saveProduct(product);
        return "redirect:/"; // Go back to home page
    }

    // 3. Admin View: See all PENDING items
    @GetMapping("/admin/review")
    public String showReviewQueue(Model model) {
        model.addAttribute("pendingItems", service.getPendingProducts());
        return "admin-dashboard"; // Looks for admin-dashboard.html
    }

    // 4. Admin Action: Approve an item
    @PostMapping("/admin/approve/{id}")
    public String approveItem(@PathVariable Long id) {
        service.approveProduct(id);
        return "redirect:/admin/review";
    }
}
