package com.swp.user_service.repository;

import com.swp.user_service.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    boolean existsByPsychologist_PsyIdAndAppointmentDateAndTimeSlot(String psychologistId, Date appointmentDate, String timeSlot);
}
