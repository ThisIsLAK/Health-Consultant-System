package com.swp.user_service.repository;

import com.swp.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
<<<<<<< HEAD
public interface UserRepository extends JpaRepository<User, String>
{
=======
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByName(String name);
>>>>>>> Hoang

    boolean existsByEmail(String email);
}
