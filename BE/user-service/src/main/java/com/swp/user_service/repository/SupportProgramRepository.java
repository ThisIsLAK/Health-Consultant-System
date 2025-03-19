package com.swp.user_service.repository;

import com.swp.user_service.entity.SupportProgram;
import com.swp.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupportProgramRepository extends JpaRepository<SupportProgram, String> {
//    Program registerUserForProgram(String email, String programId);
    Optional<SupportProgram> findByProgramCode(String programCode);
    boolean existsByProgramCode(String programCode);
    void deleteByProgramCode(String programCode);
    List<SupportProgram> findByActiveTrue();
    Optional<SupportProgram> findByProgramCodeAndActiveTrue(String programCode);
    List<SupportProgram> findByParticipantsContaining(User user);

}
