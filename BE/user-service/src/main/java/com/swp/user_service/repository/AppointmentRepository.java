package com.swp.user_service.repository;

import com.swp.user_service.entity.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    boolean existsByPsychologist_PsyIdAndAppointmentDateAndTimeSlot(String psychologistId, Date appointmentDate, String timeSlot);
    Optional<Appointment> findById(String id);
    List<Appointment> findByUser_Id(String id);

    List<Appointment> findAll();

}
