package com.warehouse.service.impl;

import com.warehouse.entity.Product;
import com.warehouse.entity.StockRecord;
import com.warehouse.repository.StockRecordRepository;
import com.warehouse.service.ProductService;
import com.warehouse.service.StockRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StockRecordServiceImpl implements StockRecordService {

    @Autowired
    private StockRecordRepository stockRecordRepository;

    @Autowired
    private ProductService productService;

    @Override
    @Transactional
    public StockRecord save(StockRecord record) {
        if (record.getCreateTime() == null) {
            record.setCreateTime(LocalDateTime.now());
        }
        // 自动同步商品库存
        Product product = record.getProduct();
        if (product != null && record.getQuantity() != null && record.getType() != null) {
            int quantity = record.getQuantity();
            if ("IN".equalsIgnoreCase(record.getType())) {
                product.setStock(product.getStock() + quantity);
            } else if ("OUT".equalsIgnoreCase(record.getType())) {
                int newStock = product.getStock() - quantity;
                product.setStock(Math.max(newStock, 0));
            }
            productService.save(product);
        }
        return stockRecordRepository.save(record);
    }

    @Override
    public Optional<StockRecord> findById(Long id) {
        return stockRecordRepository.findById(id);
    }

    @Override
    public List<StockRecord> findAll() {
        return stockRecordRepository.findAll();
    }

    @Override
    public Page<StockRecord> findAll(Pageable pageable) {
        return stockRecordRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        stockRecordRepository.deleteById(id);
    }

    @Override
    public Page<StockRecord> findByType(String type, Pageable pageable) {
        return stockRecordRepository.findByType(type, pageable);
    }

    @Override
    public Page<StockRecord> findByProductId(Long productId, Pageable pageable) {
        return stockRecordRepository.findByProductId(productId, pageable);
    }

    @Override
    public StockRecord getRecordWithDetails(Long id) {
        return stockRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock record not found"));
    }

    @Override
    @Transactional
    public boolean addStockRecord(StockRecord record) {
        try {
            if (record.getCreateTime() == null) {
                record.setCreateTime(LocalDateTime.now());
            }
            stockRecordRepository.save(record);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
} 