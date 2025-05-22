package com.warehouse.service;

import com.warehouse.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    Product save(Product product);
    Optional<Product> findById(Long id);
    List<Product> findAll();
    Page<Product> findAll(Pageable pageable);
    void deleteById(Long id);
    boolean existsByCode(String code);
    Product updateStock(Long id, Integer quantity);
    List<Product> findByCategoryId(Long categoryId);
} 