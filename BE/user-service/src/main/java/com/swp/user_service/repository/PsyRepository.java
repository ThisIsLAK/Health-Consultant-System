package com.swp.user_service.repository;

import com.swp.user_service.entity.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface PsyRepository extends JpaRepository<User, String>{
}
