package com.swp.user_service.repository;

import com.swp.user_service.entity.Appointment;

import com.swp.user_service.entity.User;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {

    boolean existsByPsychologistIdAndAppointmentDateAndTimeSlot(String psychologistId, Date appointmentDate, String timeSlot);
    boolean existsByUserIdAndAppointmentDateAndTimeSlot(String userId, Date appointmentDate, String timeSlot);

    Optional<Appointment> findById(String id);
    List<Appointment> findByUser_Id(String id);

    List<Appointment> findAll();

    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId")
    List<Appointment> findAppointmentsByUserId(@Param("userId") String userId);

    @Query("SELECT a FROM Appointment a WHERE a.psychologistId = :psychologistId")
    List<Appointment> findAppointmentsByPsychologistId(@Param("psychologistId") String psychologistId);

    @Query("SELECT a FROM Appointment a WHERE a.user.id=:userId AND a.active = :active")
    List<Appointment> findAllByUserIdAndActive(@Param("userId") String userId, @Param("active") Boolean active);

    @Query("SELECT a FROM Appointment a WHERE a.psychologistId =:psychologistId AND a.active = :active")
    List<Appointment> findAllByPsychologistIdAndActive(@Param("psychologistId") String psychologistId, @Param("active") Boolean active);

    boolean existsByUserIdAndAppointmentDate(String userId, Date appointmentDate);

    List<Appointment> findByUserIdAndPsychologistIdAndCancelledAtIsNotNull(String userId, String psychologistId);

    boolean existsByUserIdAndAppointmentDateAndCancelledAtIsNotNull(String userId, Date appointmentDate);
}
