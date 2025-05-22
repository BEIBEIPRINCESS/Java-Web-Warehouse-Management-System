package com.warehouse.service.impl;

import com.warehouse.entity.GoodsType;
import com.warehouse.repository.GoodsTypeRepository;
import com.warehouse.service.GoodsTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GoodsTypeServiceImpl implements GoodsTypeService {

    @Autowired
    private GoodsTypeRepository goodsTypeRepository;

    @Override
    @Transactional
    public GoodsType save(GoodsType goodsType) {
        return goodsTypeRepository.save(goodsType);
    }

    @Override
    public Optional<GoodsType> findById(Long id) {
        return goodsTypeRepository.findById(id);
    }

    @Override
    public List<GoodsType> findAll() {
        return goodsTypeRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        goodsTypeRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return goodsTypeRepository.existsByName(name);
    }
} 