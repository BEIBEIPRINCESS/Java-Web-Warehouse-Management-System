package com.warehouse.controller;

import com.warehouse.common.Result;
import com.warehouse.entity.User;
import com.warehouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Page<User>> page(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String username) {
        
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize);
        Page<User> page = userService.findAll(pageable);
        return Result.success(page);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<User> getById(@PathVariable Long id) {
        return userService.findById(id)
                .map(Result::success)
                .orElse(Result.error("用户不存在"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Result<User> save(@RequestBody User user) {
        if (userService.existsByUsername(user.getUsername())) {
            return Result.error("用户名已存在");
        }
        return Result.success(userService.save(user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<User> update(@PathVariable Long id, @RequestBody User user) {
        if (!userService.findById(id).isPresent()) {
            return Result.error("用户不存在");
        }
        user.setId(id);
        return Result.success(userService.save(user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return Result.success();
    }
} 