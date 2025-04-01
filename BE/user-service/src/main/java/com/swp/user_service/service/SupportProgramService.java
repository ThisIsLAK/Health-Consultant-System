package com.swp.user_service.service;

import com.swp.user_service.dto.request.SupportProgramRequest;
import com.swp.user_service.dto.request.SupportProgramSignupRequest;
import com.swp.user_service.dto.response.SupportProgramResponse;
import com.swp.user_service.dto.response.SupportProgramSummaryResponse;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
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
        SupportProgram supportProgram = supportProgramRepository.findByProgramCodeAndActiveTrue(programCode)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPORT_PROGRAM_NOT_EXIST));

        return supportProgramMapper.toResponse(supportProgram);
    }

    public List<SupportProgramResponse> getAllSupportPrograms() {
        //stream để kết hợp nhiều thao tác lại với nhau, ví dụ: map, collect, filter, ...
        //mà không cần phải sử dụng nhiều vòng lặp
        return supportProgramRepository.findAll().stream()
                .map(supportProgramMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<SupportProgramResponse> getAllActiveSupportPrograms() {
        return supportProgramRepository.findByActiveTrue().stream()
                .map(sp -> SupportProgramResponse.builder()
                        .programCode(sp.getProgramCode())
                        .programName(sp.getProgramName())
                        .description(sp.getDescription())
                        .startDate(sp.getStartDate())
                        .endDate(sp.getEndDate())
                        .build())
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

    public SupportProgramResponse getSupportProgramDetails(String programCode) {
        SupportProgram supportProgram = supportProgramRepository.findByProgramCode(programCode)
                .filter(SupportProgram::getActive) // Chỉ lấy chương trình đang active
                .orElseThrow(() -> new AppException(ErrorCode.SUPPORT_PROGRAM_NOT_EXIST));

        // Chỉ trả về các trường được yêu cầu
        return SupportProgramResponse.builder()
                .programCode(supportProgram.getProgramCode())
                .programName(supportProgram.getProgramName())
                .description(supportProgram.getDescription())
                .startDate(supportProgram.getStartDate())
                .endDate(supportProgram.getEndDate())
                .build();
    }

    public SupportProgramSummaryResponse getSupportProgramSummary() {
        List<SupportProgram> programs = supportProgramRepository.findAll();
        if (programs == null) {
            programs = Collections.emptyList();
        }

        long totalPrograms = programs.size();
        long activePrograms = programs.stream()
                .filter(program -> program.getActive() != null && program.getActive())
                .count();
        long totalParticipants = programs.stream()
                .mapToLong(program -> program.getParticipants() != null ? program.getParticipants().size() : 0)
                .sum();
        long programsEndingSoon = programs.stream()
                .filter(program -> program.getActive() != null && program.getActive())
                .filter(program -> program.getEndDate() != null)
                .filter(program -> ChronoUnit.DAYS.between(LocalDate.now(), program.getEndDate()) <= 7)
                .count();

        return SupportProgramSummaryResponse.builder()
                .totalPrograms(totalPrograms)
                .activePrograms(activePrograms)
                .totalParticipants(totalParticipants)
                .programsEndingSoon(programsEndingSoon)
                .build();
    }

    public List<SupportProgramResponse> getUserSupportProgramHistory() {
        // Lấy email từ context của người dùng đăng nhập
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        // Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        // Lấy danh sách chương trình user đã tham gia
        List<SupportProgram> registeredPrograms = supportProgramRepository.findByParticipantsContaining(user);

        // Chuyển đổi sang response DTO
        return registeredPrograms.stream()
                .map(supportProgramMapper::toResponse)
                .collect(Collectors.toList());
    }

}