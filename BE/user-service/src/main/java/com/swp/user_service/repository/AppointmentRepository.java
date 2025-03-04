package com.swp.user_service.repository;

import com.swp.user_service.entity.Appointment;

import com.swp.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {

    boolean existsByPsychologistIdAndAppointmentDateAndTimeSlot(String psychologistId, Date appointmentDate, String timeSlot);

    Optional<Appointment> findById(String id);
    List<Appointment> findByUser_Id(String id);

    List<Appointment> findAll();
    List<Appointment> findByUser(User user);

    List<Appointment> findByPsychologistId(String psychologistId);

    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId")
    List<Appointment> findAppointmentsByUserId(@Param("userId") String userId);

    @Query("SELECT a FROM Appointment a WHERE a.psychologistId = :psychologistId")
    List<Appointment> findAppointmentsByPsychologistId(@Param("psychologistId") String psychologistId);

}
