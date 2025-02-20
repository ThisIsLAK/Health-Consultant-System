package com.swp.user_service.repository;

import com.swp.user_service.entity.User;
import org.springframework.stereotype.Repository;
import com.swp.user_service.entity.Psychologist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface PysRepository extends JpaRepository<Psychologist, String>{

    boolean existsByName(String name);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
