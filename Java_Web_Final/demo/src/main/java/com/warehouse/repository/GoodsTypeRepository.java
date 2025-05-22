package com.warehouse.repository;

import com.warehouse.entity.GoodsType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoodsTypeRepository extends JpaRepository<GoodsType, Long> {
    boolean existsByName(String name);
} 