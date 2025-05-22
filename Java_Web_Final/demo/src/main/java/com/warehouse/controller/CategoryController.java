package com.warehouse.controller;

import com.warehouse.common.Result;
import com.warehouse.entity.Category;
import com.warehouse.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/page")
    public Result<Page<Category>> page(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String name) {
        
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize);
        Page<Category> page = categoryService.findAll(pageable);
        return Result.success(page);
    }

    @GetMapping("/{id}")
    public Result<Category> getById(@PathVariable Long id) {
        return categoryService.findById(id)
                .map(Result::success)
                .orElse(Result.error("分类不存在"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Category> save(@RequestBody Category category) {
        if (categoryService.existsByName(category.getName())) {
            return Result.error("分类名称已存在");
        }
        return Result.success(categoryService.save(category));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Category> update(@PathVariable Long id, @RequestBody Category category) {
        if (!categoryService.findById(id).isPresent()) {
            return Result.error("分类不存在");
        }
        category.setId(id);
        return Result.success(categoryService.save(category));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.deleteById(id);
        return Result.success();
    }
} 