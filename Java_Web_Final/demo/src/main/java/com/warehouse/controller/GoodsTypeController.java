package com.warehouse.controller;

import com.warehouse.entity.GoodsType;
import com.warehouse.service.GoodsTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goods-types")
@CrossOrigin(origins = "*")
public class GoodsTypeController {

    @Autowired
    private GoodsTypeService goodsTypeService;

    @PostMapping
    public ResponseEntity<?> createGoodsType(@RequestBody GoodsType goodsType) {
        if (goodsTypeService.existsByName(goodsType.getName())) {
            return ResponseEntity.badRequest().body("商品类型名称已存在");
        }
        return ResponseEntity.ok(goodsTypeService.save(goodsType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGoodsType(@PathVariable Long id) {
        return goodsTypeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<GoodsType>> getAllGoodsTypes() {
        return ResponseEntity.ok(goodsTypeService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoodsType(@PathVariable Long id, @RequestBody GoodsType goodsType) {
        return goodsTypeService.findById(id)
                .map(existingType -> {
                    goodsType.setId(id);
                    return ResponseEntity.ok(goodsTypeService.save(goodsType));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoodsType(@PathVariable Long id) {
        return goodsTypeService.findById(id)
                .map(type -> {
                    goodsTypeService.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 