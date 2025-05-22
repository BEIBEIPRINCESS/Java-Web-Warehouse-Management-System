package com.warehouse.service;

import com.warehouse.entity.AdminUser;

public interface AdminUserService {
    AdminUser findByUsername(String username);
} 