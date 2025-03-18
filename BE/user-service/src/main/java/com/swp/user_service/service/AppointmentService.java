package com.swp.user_service.service;

import com.swp.user_service.dto.request.AppointmentRequest;
import com.swp.user_service.dto.response.AppointmentResponse;
import com.swp.user_service.dto.response.AppointmentSummaryResponse;
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
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AppointmentService {
    private static final List<String> VALID_TIME_SLOTS = Arrays.asList("8h-10h", "10h-12h", "13h-15h", "15h-17h");
    private static final Duration COOLDOWN_PERIOD = Duration.ofHours(2);


    AppointmentRepository appointmentRepository;
    UserRepository userRepository;
    PsyRepository psychologistRepository;
    AppointmentMapper appointmentMapper;
    RoleRepository roleRepository;

    @PreAuthorize("hasAnyRole('STUDENT', 'PARENT')")
    public AppointmentResponse bookAppointment(AppointmentRequest request) {
        // kiem tra cooldown
        validateCooldown(request);

        // kiem tra slot co hop le khong
        if (!VALID_TIME_SLOTS.contains(request.getTimeSlot())) {
            throw new AppException(ErrorCode.INVALID_SLOT);
        }

        validateBookingTime(request);

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
        appointment.setActive(null);

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

        boolean userHasAppointmentOnSameDay = appointmentRepository.existsByUserIdAndAppointmentDate(
                request.getUserId(), request.getAppointmentDate()
        );

        // Nếu user đã có lịch hẹn trong cùng ngày, ném lỗi
        if (userHasAppointmentOnSameDay) {
            throw new AppException(ErrorCode.ONE_APPOINTMENT_PER_DAY_LIMIT);
        }

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

    private void validateCooldown(AppointmentRequest request) {
        List<Appointment> recentCancellations = appointmentRepository.findByUserIdAndPsychologistIdAndCancelledAtIsNotNull(
                request.getUserId(), request.getPsychologistId()
        );

        if (recentCancellations.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        for (Appointment cancellation : recentCancellations) {
            if (cancellation.getCancelledAt() != null) {
                LocalDateTime cooldownEnd = cancellation.getCancelledAt().plus(COOLDOWN_PERIOD);
                if (now.isBefore(cooldownEnd)) {
                    throw new AppException(ErrorCode.COOLDOWN_NOT_EXPIRED);
                }
            }
        }
    }
    private LocalDateTime getAppointmentStartTime(Date appointmentDate, String timeSlot) {
        // Convert Date to LocalDateTime
        Instant instant = appointmentDate.toInstant();
        LocalDateTime dateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        LocalDate datePart = dateTime.toLocalDate();

        // Parse the start time from timeSlot (e.g., "8h-10h" -> 8)
        String startHourStr = timeSlot.split("-")[0].replace("h", "").trim();
        int startHour = Integer.parseInt(startHourStr);

        // Combine date with start hour (assuming minutes are 00)
        return LocalDateTime.of(datePart.getYear(), datePart.getMonth(), datePart.getDayOfMonth(), startHour, 0);
    }

    private void validateBookingTime(AppointmentRequest request) {
        LocalDateTime appointmentStartTime = getAppointmentStartTime(request.getAppointmentDate(), request.getTimeSlot());
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime bookingDeadline = appointmentStartTime.minusHours(24);

        if (now.isAfter(bookingDeadline)) {
            throw new AppException(ErrorCode.BOOKING_TOO_LATE);
        }
    }
    private void validateCancellationTime(Appointment appointment) {
        LocalDateTime appointmentStartTime = getAppointmentStartTime(appointment.getAppointmentDate(), appointment.getTimeSlot());
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime cancellationDeadline = appointmentStartTime.minusHours(4);

        if (now.isAfter(cancellationDeadline)) {
            throw new AppException(ErrorCode.CANCELLATION_TOO_LATE);
        }
    }

    public void cancelAppointment(String appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        Boolean active = appointment.getActive();
        if (active != null && active) {
            throw new AppException(ErrorCode.APPOINTMENT_ALREADY_COMPLETED);
        }
        if (active != null && !active) {
            throw new AppException(ErrorCode.APPOINTMENT_ALREADY_CANCELLED);
        }

        validateCancellationTime(appointment);

        appointment.setActive(false);
        appointment.setCancelledAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }

    public List<AppointmentResponse> getPsychologistAppointments(String psychologistId) {
        List<Appointment> appointments = appointmentRepository.findAppointmentsByPsychologistId(psychologistId);
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

    public List<AppointmentResponse> getUserAppointments(String id) {
        List<Appointment> appointments = appointmentRepository.findByUser_Id(id);
        List<AppointmentResponse> responses = appointmentMapper.toAppointmentResponses(appointments);
        responses.forEach(response -> {
            String psychologistId = response.getPsychologistId();
            Optional<User> psychologistOpt = userRepository.findById(psychologistId)
                    .filter(p -> Objects.equals(p.getRole().getRoleId(), "4"));

            User psychologist = psychologistOpt.get();
            response.setPsychologistName(psychologist.getName());
            response.setPsychologistEmail(psychologist.getEmail());

        });
        return responses;
    }

    public List<AppointmentResponse> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        List<AppointmentResponse> responses = appointmentMapper.toAppointmentResponses(appointments);
        responses.forEach(response -> {
            String psychologistId = response.getPsychologistId();
            Optional<User> psychologistOpt = userRepository.findById(psychologistId)
                    .filter(p -> Objects.equals(p.getRole().getRoleId(), "4"));

            User psychologist = psychologistOpt.get();
            response.setPsychologistName(psychologist.getName());
            response.setPsychologistEmail(psychologist.getEmail());

        });
        return responses;
    }



    public AppointmentSummaryResponse getAppointmentSummary() {
        List<Appointment> appointments = appointmentRepository.findAll();
        if (appointments == null) {
            appointments = Collections.emptyList();
        }

        long totalAppointments = appointments.size();
        long completedAppointments = appointments.stream()
                .filter(app -> Boolean.TRUE.equals(app.getActive()))
                .count();
        long cancelledAppointments = appointments.stream()
                .filter(app -> Boolean.FALSE.equals(app.getActive()))
                .count();
        long upcomingAppointments = appointments.stream()
                .filter(app -> app.getActive() == null)
                .filter(app -> app.getAppointmentDate() != null && app.getAppointmentDate().after(new Date()))
                .count();

        return AppointmentSummaryResponse.builder()
                .totalAppointments(totalAppointments)
                .completedAppointments(completedAppointments)
                .cancelledAppointments(cancelledAppointments)
                .upcomingAppointments(upcomingAppointments)
                .build();
    }

    public void completeAppointment(String appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (appointment.getActive() != null && appointment.getActive()) {
            throw new AppException(ErrorCode.APPOINTMENT_ALREADY_COMPLETED);
        }

        if (appointment.getActive() != null && !appointment.getActive()) {
            throw new AppException(ErrorCode.APPOINTMENT_ALREADY_CANCELLED);
        }

        appointment.setActive(true);
        appointmentRepository.save(appointment);
    }

}