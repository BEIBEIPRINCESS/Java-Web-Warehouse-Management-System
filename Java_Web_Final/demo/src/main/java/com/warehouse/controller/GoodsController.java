package com.warehouse.controller;

import com.warehouse.entity.Goods;
import com.warehouse.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goods")
@CrossOrigin(origins = "*")
public class GoodsController {

    @Autowired
    private GoodsService goodsService;

    @PostMapping
    public ResponseEntity<?> createGoods(@RequestBody Goods goods) {
        if (goodsService.existsByCode(goods.getCode())) {
            return ResponseEntity.badRequest().body("商品编码已存在");
        }
        return ResponseEntity.ok(goodsService.save(goods));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGoods(@PathVariable Long id) {
        return goodsService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Goods>> getAllGoods() {
        return ResponseEntity.ok(goodsService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoods(@PathVariable Long id, @RequestBody Goods goods) {
        return goodsService.findById(id)
                .map(existingGoods -> {
                    goods.setId(id);
                    return ResponseEntity.ok(goodsService.save(goods));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoods(@PathVariable Long id) {
        return goodsService.findById(id)
                .map(goods -> {
                    goodsService.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{typeId}")
    public ResponseEntity<List<Goods>> getGoodsByType(@PathVariable Long typeId) {
        return ResponseEntity.ok(goodsService.findByTypeId(typeId));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            Goods updatedGoods = goodsService.updateStock(id, quantity);
            return ResponseEntity.ok(updatedGoods);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 