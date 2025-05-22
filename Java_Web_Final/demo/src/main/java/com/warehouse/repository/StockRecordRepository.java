package com.warehouse.repository;

import com.warehouse.entity.StockRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StockRecordRepository extends JpaRepository<StockRecord, Long> {
    Page<StockRecord> findByType(String type, Pageable pageable);
    Page<StockRecord> findByProductId(Long productId, Pageable pageable);
} 