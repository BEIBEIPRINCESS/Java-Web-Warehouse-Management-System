package com.warehouse.service.impl;

import com.warehouse.entity.Goods;
import com.warehouse.repository.GoodsRepository;
import com.warehouse.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GoodsServiceImpl implements GoodsService {

    @Autowired
    private GoodsRepository goodsRepository;

    @Override
    @Transactional
    public Goods save(Goods goods) {
        return goodsRepository.save(goods);
    }

    @Override
    public Optional<Goods> findById(Long id) {
        return goodsRepository.findById(id);
    }

    @Override
    public List<Goods> findAll() {
        return goodsRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        goodsRepository.deleteById(id);
    }

    @Override
    public boolean existsByCode(String code) {
        return goodsRepository.existsByCode(code);
    }

    @Override
    @Transactional
    public Goods updateStock(Long id, Integer quantity) {
        Goods goods = goodsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("商品不存在"));
        goods.setStock(goods.getStock() + quantity);
        return goodsRepository.save(goods);
    }

    @Override
    public List<Goods> findByTypeId(Long typeId) {
        return goodsRepository.findAll().stream()
                .filter(goods -> goods.getCategory().getId().equals(typeId))
                .collect(Collectors.toList());
    }
} 