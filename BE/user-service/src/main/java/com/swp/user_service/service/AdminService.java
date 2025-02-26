package com.swp.user_service.service;

import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.entity.User;
import com.swp.user_service.mapper.UserMapper;
import com.swp.user_service.repository.RoleRepository;
import com.swp.user_service.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {

            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setActive(false);
                userRepository.save(user);
                log.info(userId + " has been deleted.");
            } else {
                throw new EntityNotFoundException("User not found with ID: " + userId);
            }
    }

    //Kiem tra truoc luc goi ham. Neu la role ADMIN thi moi goi duoc ham
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers(){

        log.info("In method get users");

        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }
}
