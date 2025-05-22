package com.warehouse.service;

import com.warehouse.entity.Goods;
import java.util.List;
import java.util.Optional;

public interface GoodsService {
    Goods save(Goods goods);
    Optional<Goods> findById(Long id);
    List<Goods> findAll();
    void deleteById(Long id);
    boolean existsByCode(String code);
    Goods updateStock(Long id, Integer quantity);
    List<Goods> findByTypeId(Long typeId);
} 