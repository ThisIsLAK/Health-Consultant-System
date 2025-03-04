package com.swp.user_service.service;

import com.swp.user_service.dto.request.PsychologistUpdateRequest;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.entity.User;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.PsychologistMapper;
import com.swp.user_service.mapper.UserMapper;
import com.swp.user_service.repository.PsyRepository;
import com.swp.user_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PsyService {

    PsyRepository psychologistRepository;
    UserRepository userRepository;
    PsychologistMapper psychologistMapper;
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;

    public UserResponse getPsychologistById(String id) {
        User user = userRepository.findById(id)
                .filter(u -> Objects.equals(u.getRole().getRoleId(), "4"))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        return userMapper.toUserResponse(user);
    }

    public UserResponse updatePsy(String id, PsychologistUpdateRequest request) {
        // Tìm psychologist theo ID và đảm bảo roleId = 4
        User psychologist = userRepository.findById(id)
                .filter(user -> Objects.equals(user.getRole().getRoleId(), "4"))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        // Cập nhật name nếu không null hoặc rỗng
        if (request.getName() != null && !request.getName().isEmpty()) {
            psychologist.setName(request.getName());
        }

        // Cập nhật email nếu không null hoặc rỗng
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            psychologist.setEmail(request.getEmail());
        }

        // Cập nhật password nếu không null hoặc rỗng (cần hash password nếu có)
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(request.getPassword()); // Cần inject PasswordEncoder
            psychologist.setPassword(hashedPassword);
        }

        // Lưu lại thông tin psychologist sau khi cập nhật
        User updatedPsychologist = userRepository.save(psychologist);

        return userMapper.toUserResponse(updatedPsychologist);
    }

    public List<UserResponse> getAllPsychologists() {
        List<UserResponse> psychologists = userRepository.findAll().stream()
                .filter(user -> Objects.equals(user.getRole().getRoleId(), "4"))
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
        return psychologists;
    }
}
