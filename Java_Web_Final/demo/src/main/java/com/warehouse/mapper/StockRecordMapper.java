package com.warehouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.warehouse.entity.StockRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface StockRecordMapper extends BaseMapper<StockRecord> {
    @Select("SELECT sr.*, p.name as productName, u.name as operatorName " +
            "FROM stock_record sr " +
            "LEFT JOIN product p ON sr.product_id = p.id " +
            "LEFT JOIN user u ON sr.operator_id = u.id " +
            "WHERE sr.id = #{id}")
    StockRecord getRecordWithDetails(Integer id);
} 