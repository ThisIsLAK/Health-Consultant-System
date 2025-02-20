package com.swp.user_service.repository;

import com.swp.user_service.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ProgramRepository extends JpaRepository<Program, String> {
//    Program registerUserForProgram(String email, String programId);
}
