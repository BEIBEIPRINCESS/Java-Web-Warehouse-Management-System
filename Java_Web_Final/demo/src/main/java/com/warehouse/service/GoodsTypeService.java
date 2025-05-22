package com.warehouse.service;

import com.warehouse.entity.GoodsType;
import java.util.List;
import java.util.Optional;

public interface GoodsTypeService {
    GoodsType save(GoodsType goodsType);
    Optional<GoodsType> findById(Long id);
    List<GoodsType> findAll();
    void deleteById(Long id);
    boolean existsByName(String name);
} 