package com.swp.user_service.repository;

import org.springframework.stereotype.Repository;
import com.swp.user_service.entity.Pyschologist;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface PysRepository extends JpaRepository<Pyschologist, String>{
}
