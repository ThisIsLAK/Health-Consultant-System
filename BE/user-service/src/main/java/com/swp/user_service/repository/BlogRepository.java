package com.swp.user_service.repository;

import com.swp.user_service.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, String> {
    boolean existsByBlogCode(String blogCode);

    Optional<Blog> findByBlogCode(String blogCode);
}
