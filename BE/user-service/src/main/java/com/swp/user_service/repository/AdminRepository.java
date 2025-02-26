package com.swp.user_service.repository;

import com.swp.user_service.entity.Admin;

import com.swp.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<User> findByEmail(String email);
}
