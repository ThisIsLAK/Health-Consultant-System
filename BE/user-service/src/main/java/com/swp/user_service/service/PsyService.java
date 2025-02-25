package com.swp.user_service.service;

import com.swp.user_service.dto.request.PsychologistCreationRequest;
import com.swp.user_service.dto.request.PsychologistUpdateRequest;
import com.swp.user_service.dto.response.PsychologistResponse;
import com.swp.user_service.entity.Psychologist;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.PsychologistMapper;
import com.swp.user_service.repository.PsyRepository;
import com.swp.user_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PsyService {

    PsyRepository psychologistRepository;
    UserRepository userRepository;
    PsychologistMapper psychologistMapper;
    PasswordEncoder passwordEncoder;

    public PsychologistResponse createPsychologist(PsychologistCreationRequest request) {
        if (psychologistRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXIST);
        }

        // Chuyển request thành entity
        Psychologist psychologist = psychologistMapper.toPsychologist(request);
        psychologist.setPassword(passwordEncoder.encode(request.getPassword()));

        return psychologistMapper.toPsychologistResponse(psychologistRepository.save(psychologist));
    }

    public PsychologistResponse getPsychologistById(String id) {
        Psychologist psychologist = psychologistRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        return psychologistMapper.toPsychologistResponse(psychologist);
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



//    public PsychologistResponse updatePsychologist(String psychologistId, PsychologistUpdateRequest request) {
//        Psychologist psychologist = psychologistRepository.findById(psychologistId)
//                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));
//
//        psychologistMapper.updatePsychologist(psychologist, request);
//
//        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
//            psychologist.setPassword(passwordEncoder.encode(request.getPassword()));
//        }
//
//        return psychologistMapper.toPsychologistResponse(psychologistRepository.save(psychologist));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    public List<PsychologistResponse> getAllPsychologists() {
//        return psychologistRepository.findAll().stream()
//                .map(psychologistMapper::toPsychologistResponse)
//                .toList();
//    }

    public void deletePsychologist(String psychologistId) {
        psychologistRepository.deleteById(psychologistId);
    }
}
