package com.swp.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String appointmentId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    String psychologistId;

    @Temporal(TemporalType.TIMESTAMP)
    Date appointmentDate;

    String timeSlot;

    LocalDateTime cancelledAt;

    private Boolean active;
    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}