package com.swp.user_service.service;

import com.swp.user_service.dto.request.SupportProgramRequest;
import com.swp.user_service.dto.request.SupportProgramSignupRequest;
import com.swp.user_service.dto.response.SupportProgramResponse;
import com.swp.user_service.entity.SupportProgram;
import com.swp.user_service.entity.User;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.SupportProgramMapper;
import com.swp.user_service.repository.SupportProgramRepository;
import com.swp.user_service.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SupportProgramService {

    SupportProgramRepository supportProgramRepository;
    SupportProgramMapper supportProgramMapper;
    UserRepository userRepository;


    public SupportProgramResponse createSupportProgram(SupportProgramRequest request) {
        if (supportProgramRepository.existsByProgramCode(request.getProgramCode()))
            throw new AppException(ErrorCode.SUPPORT_PROGRAM_EXIST);

        SupportProgram supportProgram = supportProgramMapper.toEntity(request);
        supportProgram = supportProgramRepository.save(supportProgram);
        return supportProgramMapper.toResponse(supportProgram);
    }

    public SupportProgramResponse findByProgramCode(String programCode) {
        SupportProgram supportProgram = supportProgramRepository.findByProgramCode(programCode)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPORT_PROGRAM_NOT_EXIST));

        return supportProgramMapper.toResponse(supportProgram);
    }

    public List<SupportProgramResponse> getAllSupportPrograms() {
        return supportProgramRepository.findAll().stream()
                .map(supportProgramMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<SupportProgramResponse> getAllActiveSupportPrograms() {
        return supportProgramRepository.findByActiveTrue().stream()
                .map(supportProgramMapper::toResponse)
                .collect(Collectors.toList());
    }


    public SupportProgramResponse updateSupportProgram(String programCode, SupportProgramRequest request) {
        SupportProgram existingProgram = supportProgramRepository.findByProgramCode(programCode)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPORT_PROGRAM_NOT_EXIST));
        supportProgramMapper.updateSupportProgramFromRequest(request, existingProgram);
        existingProgram = supportProgramRepository.save(existingProgram);
        return supportProgramMapper.toResponse(existingProgram);
    }


    public void deleteSupportProgram(String programCode) {
        Optional<SupportProgram> supportProgramOptional = supportProgramRepository.findByProgramCode(programCode);
        if (supportProgramOptional.isPresent()) {
            SupportProgram supportProgram = supportProgramOptional.get();
            supportProgram.setActive(false);
            supportProgramRepository.save(supportProgram);
            log.info(programCode + " has been deleted.");
        } else {
            throw new AppException(ErrorCode.SUPPORT_PROGRAM_NOT_EXIST);
        }
    }


    public SupportProgramResponse signupForProgram(SupportProgramSignupRequest request, String email) {
        SupportProgram supportProgram = supportProgramRepository.findByProgramCode(request.getProgramCode())
                .orElseThrow(() -> new AppException(ErrorCode.SUPPORT_PROGRAM_NOT_EXIST));

        // Kiểm tra xem chương trình có đang active không
        if (!Boolean.TRUE.equals(supportProgram.getActive())) {
            throw new AppException(ErrorCode.SUPPORT_PROGRAM_NOT_EXIST);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        // Kiểm tra nếu user chưa đăng ký
        if (!supportProgram.getParticipants().contains(user)) {
            supportProgram.getParticipants().add(user);
            supportProgram.setRegisteredUsers(supportProgram.getParticipants().size()); // Cập nhật số lượng user đã đăng ký
            supportProgramRepository.save(supportProgram);

            // Fetch lại User để đảm bảo Role được load đầy đủ
            user = userRepository.findByEmail(email).get();
        }
        else {
            throw new AppException(ErrorCode.USER_SIGNUP_ALREADY);
        }

        return supportProgramMapper.toResponse(supportProgram);
    }

}