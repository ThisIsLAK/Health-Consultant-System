package com.swp.user_service.service;

import com.swp.user_service.dto.request.ResetPasswordRequest;
import com.swp.user_service.dto.request.UserUpdateByAdminRequest;
import com.swp.user_service.dto.request.UserUpdateRequest;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.entity.User;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.UserMapper;
import com.swp.user_service.repository.RoleRepository;
import com.swp.user_service.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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

    public UserResponse getUserByEmail(String email) {
        log.info("In method get user by Id");
        return userMapper.toUserResponse(userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST)));
    }

    //cap lai mat khau cho user

    public UserResponse resetUserPassword(String email, ResetPasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        return userMapper.toUserResponse(userRepository.save(user));
    }

    //cap nhat thong tin user

    public UserResponse updateUserByAdmin(String email, UserUpdateByAdminRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra và cập nhật từng trường nếu request không null
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }
}
