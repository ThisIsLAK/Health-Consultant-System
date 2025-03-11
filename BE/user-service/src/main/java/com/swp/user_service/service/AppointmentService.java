package com.swp.user_service.service;

import com.swp.user_service.dto.request.AppointmentRequest;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.entity.Appointment;
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
import java.util.Objects;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AppointmentService {
    private static final List<String> VALID_TIME_SLOTS = Arrays.asList("8h-10h", "10h-12h", "13h-15h", "15h-17h");

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

        // lay danh sach psy trong user su dung role id
        User psychologist = userRepository.findById(request.getPsychologistId())
                .filter(p -> Objects.equals(p.getRole().getRoleId(), "4")) //kiem tra roleid = 4 hay khong
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        if (!psychologist.getActive()) {
            throw new AppException(ErrorCode.PYSOCHOLOGIST_NOT_ACTIVE );
        }

        //goi ham kiem tra slot da duoc booking chua
        validateSlotAvailability(request);

        // tao cuoc hen
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setPsychologistId(psychologist.getId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setTimeSlot(request.getTimeSlot());
        appointment.setActive(true);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return appointmentMapper.toAppointmentResponse(savedAppointment);
    }

    private void validateSlotAvailability(AppointmentRequest request) {
        // Kiểm tra xem slot có hợp lệ không
        if (!VALID_TIME_SLOTS.contains(request.getTimeSlot())) {
            throw new AppException(ErrorCode.INVALID_SLOT);
        }

        // Lấy psychologist từ userRepository với roleId = 4
        User psychologist = userRepository.findById(request.getPsychologistId())
                .filter(p -> Objects.equals(p.getRole().getRoleId(), "4")) // Kiểm tra roleId = 4
                .orElseThrow(() -> new AppException(ErrorCode.NOT_PSYCHOLOGIST));

        // Kiểm tra xem slot có bị trùng không (cùng ngày, cùng khung giờ, cùng psychologist)
        boolean slotAlreadyBooked = appointmentRepository.existsByPsychologistIdAndAppointmentDateAndTimeSlot(
                psychologist.getId(), request.getAppointmentDate(), request.getTimeSlot()
        );

        // Nếu slot đã bị đặt trước đó, ném lỗi
        if (slotAlreadyBooked) {
            throw new AppException(ErrorCode.SLOT_IS_BOOKING);
        }

        boolean userSlotAlreadyBooked = appointmentRepository.existsByUserIdAndAppointmentDateAndTimeSlot(
                request.getUserId(), request.getAppointmentDate(), request.getTimeSlot()
        );

        if (userSlotAlreadyBooked) {
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
        List<Appointment> appointments = appointmentRepository.findAppointmentsByPsychologistId(psychologistId);

        return appointments.stream().map(appointment -> {
            AppointmentResponse response = new AppointmentResponse();
            response.setAppointmentId(appointment.getAppointmentId());
            response.setAppointmentDate(appointment.getAppointmentDate());
            response.setTimeSlot(appointment.getTimeSlot());
            response.setUserId(appointment.getUser().getId()); // Đảm bảo lấy đúng UserId
            response.setPsychologistId(appointment.getPsychologistId()); // Lấy psychologistId từ field riêng
            return response;
        }).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getUserAppointments(String id) {
        List<Appointment> appointments = appointmentRepository.findByUser_Id(id);
        return appointments.stream()
                .map(appointmentMapper::toAppointmentResponse)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentResponse> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointmentMapper.toAppointmentResponses(appointments);
    }
    

}