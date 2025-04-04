package com.swp.user_service.repository;

import com.swp.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    Optional<User> findById(String id);
    List<User> findAllByActive(Boolean active);

    boolean existsByActive(Boolean active);

    List<User> findByRole_RoleIdAndActive(String roleId, Boolean active); // Truy vấn theo roleId và trạng thái active

    Optional<User> findByVerificationToken(String token);

    Boolean existsByEmailVerified(Boolean active);
}
