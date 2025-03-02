package com.swp.user_service.service;

import com.swp.user_service.dto.request.PsychologistCreationRequest;
import com.swp.user_service.dto.request.PsychologistUpdateRequest;
import com.swp.user_service.dto.response.PsychologistResponse;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.entity.Psychologist;
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

    public PsychologistResponse createPsychologist(PsychologistCreationRequest request) {
        if (psychologistRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXIST);
        }

        // Chuyển request thành entity
        Psychologist psychologist = psychologistMapper.toPsychologist(request);
        psychologist.setPassword(passwordEncoder.encode(request.getPassword()));

        return psychologistMapper.toPsychologistResponse(psychologistRepository.save(psychologist));
    }

    public UserResponse getPsychologistById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        // Kiểm tra user có đúng role không (để tránh lấy nhầm user)
        if (!"PSYCHOLOGIST".equals(user.getRole().getRoleName())) {
            throw new AppException(ErrorCode.NOT_PSYCHOLOGIST);
        }

        return userMapper.toUserResponse(user);
    }
    public PsychologistResponse updatePsy(String psyId, PsychologistUpdateRequest request) {
        // Tìm psychologist theo ID, nếu không tồn tại thì ném lỗi
        Psychologist psychologist = psychologistRepository.findById(psyId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        // Cập nhật các trường có trong request nếu không null
        if (request.getSpecialization() != null && !request.getSpecialization().isEmpty()) {
            psychologist.setSpecialization(request.getSpecialization());
        }

        // Lưu psychologist sau khi cập nhật
        Psychologist updatedPsychologist = psychologistRepository.save(psychologist);

        // Chuyển entity thành response và trả về
        return psychologistMapper.toPsychologistResponse(updatedPsychologist);
    }
    public List<UserResponse> getAllPsychologists() {
        List<User> psychologists = userRepository.findByRole_RoleName("PSYCHOLOGIST");
        return psychologists.stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    public void deletePsychologist(String psychologistId) {
        psychologistRepository.deleteById(psychologistId);
    }
}
