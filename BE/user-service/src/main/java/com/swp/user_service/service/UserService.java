package com.swp.user_service.service;

import com.swp.user_service.dto.request.UserCreationRequest;
import com.swp.user_service.dto.request.UserUpdateRequest;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.entity.Appointment;
import com.swp.user_service.entity.User;
import com.swp.user_service.entity.Role;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.AppointmentMapper;
import com.swp.user_service.mapper.UserMapper;
import com.swp.user_service.repository.AppointmentRepository;
import com.swp.user_service.repository.RoleRepository;
import com.swp.user_service.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {

    UserRepository userRepository ;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    AppointmentMapper appointmentMapper;
    AppointmentRepository appointmentRepository;

    public UserResponse createUser(UserCreationRequest request) {

        if (userRepository.existsByEmail(request.getEmail()))
            throw new AppException(ErrorCode.EMAIL_EXIST);

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByRoleName("STUDENT")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        user.setRole(role);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        return userMapper.toUserResponse(user);
    }

    public UserResponse updateUser(String userId, UserUpdateRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateUser(user, request);

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }


    public UserResponse getUser(String userId){
        return userMapper.toUserResponse(userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST)));
    }


    public List<AppointmentResponse> getAppointmentHistory(String userId) {
        List<Appointment> appointments = appointmentRepository.findAppointmentsByUserId(userId);

        return appointments.stream().map(appointment -> {
            AppointmentResponse response = new AppointmentResponse();
            response.setAppointmentId(appointment.getAppointmentId());
            response.setAppointmentDate(appointment.getAppointmentDate());
            response.setTimeSlot(appointment.getTimeSlot());
            response.setUserId(appointment.getUser().getId());
            response.setActive(appointment.getActive());
            response.setPsychologistId(appointment.getPsychologistId());
            return response;
        }).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAllActiveAppointments(String userId) {

        List<Appointment> appointments = appointmentRepository.findAllByUserIdAndActive(userId, true);

        return appointments.stream().map(appointment -> {
            AppointmentResponse response = new AppointmentResponse();
            response.setPsychologistId(appointment.getPsychologistId());
            response.setAppointmentId(appointment.getAppointmentId());
            response.setAppointmentDate(appointment.getAppointmentDate());
            response.setTimeSlot(appointment.getTimeSlot());
            response.setUserId(appointment.getUser().getId());
            return response;
        }).collect(Collectors.toList());
    }
}
