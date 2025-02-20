package com.swp.user_service.configuration;

import com.swp.user_service.entity.User;
import com.swp.user_service.entity.Role;
import com.swp.user_service.repository.RoleRepository;
import com.swp.user_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {

                // Lấy Role ADMIN từ database
                Role adminRole = roleRepository.findByRoleName("ADMIN")
                        .orElseThrow(() ->  new RuntimeException("Role ADMIN not found!"));

                User user = User.builder()
                        .name("admin")
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(adminRole)  // Gán Role entity
                        .build();

                userRepository.save(user);
                log.warn("Admin has been created with default password admin123, please change it");
            }
        };
    }

}
