package com.warehouse.controller;

import com.warehouse.common.Result;
import com.warehouse.entity.Product;
import com.warehouse.entity.Category;
import com.warehouse.service.ProductService;
import com.warehouse.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/page")
    public Result<Page<Product>> page(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) Long categoryId) {
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
        Page<Product> page = productService.findAll(pageable);
        return Result.success(page);
    }

    @GetMapping("/{id}")
    public Result<Product> getById(@PathVariable Long id) {
        return productService.findById(id)
                .map(Result::success)
                .orElse(Result.error("产品不存在"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Product> save(@RequestBody Map<String, Object> productMap) {
        try {
            String code = (String) productMap.get("code");
            if (productService.existsByCode(code)) {
                return Result.error("产品编码已存在");
            }
            Product product = new Product();
            product.setName((String) productMap.get("name"));
            product.setCode(code);
            product.setPrice(productMap.get("price") != null ? Double.valueOf(productMap.get("price").toString()) : null);
            product.setStock(productMap.get("stock") != null ? Integer.valueOf(productMap.get("stock").toString()) : 0);
            product.setUnit((String) productMap.get("unit"));
            product.setSpecification((String) productMap.get("specification"));
            product.setDescription((String) productMap.get("description"));
            // 分类
            if (productMap.get("categoryId") != null) {
                Long categoryId = Long.valueOf(productMap.get("categoryId").toString());
                Category category = categoryService.findById(categoryId).orElseThrow(() -> new RuntimeException("分类不存在"));
                product.setCategory(category);
            }
            return Result.success(productService.save(product));
        } catch (Exception e) {
            return Result.error("保存商品失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Product> update(@PathVariable Long id, @RequestBody Product product) {
        if (!productService.findById(id).isPresent()) {
            return Result.error("产品不存在");
        }
        product.setId(id);
        return Result.success(productService.save(product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> delete(@PathVariable Long id) {
        productService.deleteById(id);
        return Result.success();
    }
} 