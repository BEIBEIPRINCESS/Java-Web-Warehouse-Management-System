package com.warehouse.service;

import com.warehouse.entity.StockRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface StockRecordService {
    StockRecord save(StockRecord record);
    Optional<StockRecord> findById(Long id);
    List<StockRecord> findAll();
    Page<StockRecord> findAll(Pageable pageable);
    void deleteById(Long id);
    Page<StockRecord> findByType(String type, Pageable pageable);
    Page<StockRecord> findByProductId(Long productId, Pageable pageable);
    StockRecord getRecordWithDetails(Long id);
    boolean addStockRecord(StockRecord record);
} 