package com.warehouse.service;

import com.warehouse.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User register(User user);
    User login(String username, String password);
    User findByUsername(String username);
    boolean updatePassword(Long id, String oldPassword, String newPassword);
    User save(User user);
    Optional<User> findById(Long id);
    List<User> findAll();
    Page<User> findAll(Pageable pageable);
    void deleteById(Long id);
    boolean existsByUsername(String username);
} 