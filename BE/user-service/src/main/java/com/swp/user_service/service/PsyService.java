package com.swp.user_service.service;

import com.swp.user_service.dto.request.PsychologistUpdateRequest;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.entity.Appointment;
import com.swp.user_service.entity.User;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.AppointmentMapper;
import com.swp.user_service.mapper.PsychologistMapper;
import com.swp.user_service.mapper.UserMapper;
import com.swp.user_service.repository.AppointmentRepository;
import com.swp.user_service.repository.PsyRepository;
import com.swp.user_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    AppointmentRepository appointmentRepository;
    AppointmentMapper appointmentMapper;

    public UserResponse getPsychologistById(String id) {
        User user = userRepository.findById(id)
                .filter(u -> Objects.equals(u.getRole().getRoleId(), "4"))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        return userMapper.toUserResponse(user);
    }

    public UserResponse updatePsy(String id, PsychologistUpdateRequest request) {
        // tim psychologist theo id
        User psychologist = userRepository.findById(id)
                .filter(user -> Objects.equals(user.getRole().getRoleId(), "4"))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        // cap nhat thông tin psychologist
        if (request.getName() != null && !request.getName().isEmpty()) {
            psychologist.setName(request.getName());
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            psychologist.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(request.getPassword()); //PasswordEncoder
            psychologist.setPassword(hashedPassword);
        }

        // luu lai thong tin psychologist sau khi cap nhat
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

    public List<AppointmentResponse> getAllActiveAppointments(String psychologistId) {
        List<Appointment> appointments = appointmentRepository.findAllByPsychologistIdAndActive(psychologistId, true);
        List<AppointmentResponse> responses = appointmentMapper.toAppointmentResponses(appointments);

        responses.forEach(response -> {
            String psyId = response.getPsychologistId();
            Optional<User> psychologistOpt = userRepository.findById(psyId)
                    .filter(p -> Objects.equals(p.getRole().getRoleId(), "4"));

            User psychologist = psychologistOpt.get();
            response.setPsychologistName(psychologist.getName());
            response.setPsychologistEmail(psychologist.getEmail());

        });
        return responses;
}

}
