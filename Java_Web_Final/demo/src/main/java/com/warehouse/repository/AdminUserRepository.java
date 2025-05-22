package com.warehouse.repository;

import com.warehouse.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Integer> {
    AdminUser findByUsername(String username);
} 