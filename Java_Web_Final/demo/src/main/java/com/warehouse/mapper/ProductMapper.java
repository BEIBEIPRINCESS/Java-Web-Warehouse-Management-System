package com.warehouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.warehouse.entity.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
    @Select("SELECT p.*, c.name as categoryName FROM product p LEFT JOIN category c ON p.category_id = c.id WHERE p.id = #{id}")
    Product getProductWithCategory(Integer id);
} 