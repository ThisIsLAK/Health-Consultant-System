package com.swp.user_service.service;

import com.swp.user_service.dto.request.ResetPasswordRequest;
import com.swp.user_service.dto.request.UserCreationRequest;
import com.swp.user_service.dto.request.UserUpdateByAdminRequest;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.entity.Role;
import com.swp.user_service.entity.User;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.UserMapper;
import com.swp.user_service.repository.PsyRepository;
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
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    PsyRepository psyRepository;



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

    //tao tk cho moi user
    public UserResponse createUserByAdmin(UserCreationRequest request) {

        if (userRepository.existsByEmail(request.getEmail()))
            throw new AppException(ErrorCode.EMAIL_EXIST);

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new AppException(ErrorCode.NAME_REQUIRED);
        }

        String roleId = request.getRoleId() != null ? request.getRoleId() : "2"; // mac dinh la STUDENT neu khong co role duoc them vao trong luc tao
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(true);
        user.setRole(role);

        try {

            User savedUser = userRepository.save(user);

            return userMapper.toUserResponse(savedUser);
        } catch (Exception e) {
            throw new AppException(ErrorCode.USER_CREATION_FAILED);
        }
    }

    public List<UserResponse> getAllUserByActive() {
        List<User> activeUsers = userRepository.findAllByActive(true);
        if (activeUsers.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_EXIST);
        }
        return activeUsers.stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public List<UserResponse> getAllStudents() {
        return userRepository.findAll().stream()
                .filter(user -> Objects.equals(user.getRole().getRoleId(), "2")
                        && Boolean.TRUE.equals(user.getActive()))
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAllParents() {
        return userRepository.findAll().stream()
                .filter(user -> Objects.equals(user.getRole().getRoleId(), "5")
                        && Boolean.TRUE.equals(user.getActive()))
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }
}
