package com.warehouse.repository;

import com.warehouse.entity.Goods;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoodsRepository extends JpaRepository<Goods, Long> {
    boolean existsByCode(String code);
} 