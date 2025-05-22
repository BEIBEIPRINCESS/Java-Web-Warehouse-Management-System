package com.warehouse.controller;

import com.warehouse.common.Result;
import com.warehouse.entity.Product;
import com.warehouse.entity.StockRecord;
import com.warehouse.service.ProductService;
import com.warehouse.service.StockRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

class StockRecordDTO {
    public String type;
    public Long productId;
    public Integer quantity;
    public String remark;
}

@RestController
@RequestMapping("/api/stock-records")
public class StockRecordController {

    @Autowired
    private StockRecordService stockRecordService;

    @Autowired
    private ProductService productService;

    @GetMapping("/page")
    public Result<Page<StockRecord>> page(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long productId) {
        
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize);
        Page<StockRecord> page;
        
        if (type != null && !type.isEmpty()) {
            page = stockRecordService.findByType(type, pageable);
        } else if (productId != null) {
            page = stockRecordService.findByProductId(productId, pageable);
        } else {
            page = stockRecordService.findAll(pageable);
        }
        
        return Result.success(page);
    }

    // @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping
    public Result<StockRecord> save(@RequestBody StockRecordDTO dto) {
        Product product = productService.findById(dto.productId)
            .orElseThrow(() -> new RuntimeException("商品不存在"));
        StockRecord record = new StockRecord();
        record.setType(dto.type);
        record.setProduct(product);
        record.setQuantity(dto.quantity);
        record.setRemark(dto.remark);
        // createTime由@PrePersist自动处理
        return Result.success(stockRecordService.save(record));
    }

    @PutMapping("/{id}")
    public Result<StockRecord> update(@PathVariable Long id, @RequestBody StockRecordDTO dto) {
        StockRecord record = stockRecordService.findById(id)
            .orElseThrow(() -> new RuntimeException("库存记录不存在"));
        Product product = productService.findById(dto.productId)
            .orElseThrow(() -> new RuntimeException("商品不存在"));
        record.setType(dto.type);
        record.setProduct(product);
        record.setQuantity(dto.quantity);
        record.setRemark(dto.remark);
        return Result.success(stockRecordService.save(record));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        stockRecordService.deleteById(id);
        return Result.success();
    }
} 