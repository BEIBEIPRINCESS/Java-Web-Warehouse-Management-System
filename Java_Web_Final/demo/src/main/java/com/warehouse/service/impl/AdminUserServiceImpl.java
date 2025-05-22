package com.warehouse.service.impl;

import com.warehouse.entity.AdminUser;
import com.warehouse.repository.AdminUserRepository;
import com.warehouse.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminUserServiceImpl implements AdminUserService {
    @Autowired
    private AdminUserRepository adminUserRepository;

    @Override
    public AdminUser findByUsername(String username) {
        return adminUserRepository.findByUsername(username);
    }
} 