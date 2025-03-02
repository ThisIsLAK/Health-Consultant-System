package com.swp.user_service.service;

import com.swp.user_service.dto.request.AppointmentRequest;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.entity.Appointment;
import com.swp.user_service.entity.Psychologist;
import com.swp.user_service.entity.User;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.AppointmentMapper;
import com.swp.user_service.repository.AppointmentRepository;
import com.swp.user_service.repository.PsyRepository;
import com.swp.user_service.repository.RoleRepository;
import com.swp.user_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AppointmentService {
    private static final List<String> VALID_TIME_SLOTS = Arrays.asList("7h-9h", "10h-12h", "13h-15h", "15h-17h");

    AppointmentRepository appointmentRepository;
    UserRepository userRepository;
    PsyRepository psychologistRepository;
    AppointmentMapper appointmentMapper;
    RoleRepository roleRepository;

    @PreAuthorize("hasAnyRole('STUDENT', 'PARENT')")
    public AppointmentResponse bookAppointment(AppointmentRequest request) {

        // kiem tra slot co hop le khong
        if (!VALID_TIME_SLOTS.contains(request.getTimeSlot())) {
            throw new AppException(ErrorCode.INVALID_SLOT);
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        // Check if psychologist exists and is active
        Psychologist psychologist = psychologistRepository.findById(request.getPsychologistId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        if (!psychologist.getActive()) {
            throw new AppException(ErrorCode.PYSOCHOLOGIST_NOT_ACTIVE );
        }

        //goi ham kiem tra slot da duoc booking chua
        validateSlotAvailability(request);

        // tao cuoc hen
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setPsychologist(psychologist);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setTimeSlot(request.getTimeSlot());
        appointment.setActive(true);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return appointmentMapper.toAppointmentResponse(savedAppointment);
    }


    //kiem tra xem slot da duoc booking chua
    private void validateSlotAvailability(AppointmentRequest request) {
        boolean slotIsBooking = appointmentRepository.existsByPsychologist_PsyIdAndAppointmentDateAndTimeSlot(
                request.getPsychologistId(), request.getAppointmentDate(), request.getTimeSlot()
        );
        if (slotIsBooking) {
            throw new AppException(ErrorCode.SLOT_IS_BOOKING);
        }
    }

    public void cancelAppointment(String appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        appointment.setActive(false);
        appointmentRepository.save(appointment);
    }

    public List<AppointmentResponse> getPsychologistAppointments(String psychologistId) {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.getPsychologist().getPsyId().equals(psychologistId))
                .map(appointmentMapper::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getUserAppointments(String userId) {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.getUser().getId().equals(userId))
                .map(appointmentMapper::toAppointmentResponse)
                .collect(Collectors.toList());
    }
    public List<AppointmentResponse> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointmentMapper.toAppointmentResponses(appointments);
    }

}