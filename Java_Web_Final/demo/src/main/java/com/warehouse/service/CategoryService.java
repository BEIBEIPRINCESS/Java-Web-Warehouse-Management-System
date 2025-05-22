package com.warehouse.service;

import com.warehouse.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface CategoryService {
    Category save(Category category);
    Optional<Category> findById(Long id);
    List<Category> findAll();
    Page<Category> findAll(Pageable pageable);
    void deleteById(Long id);
    boolean existsByName(String name);
} 