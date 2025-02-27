package com.swp.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Date;

//@Entity
////@Table(name = "appointments")
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE)
//public class Appointment {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    String appointmentId;
//
//    @Column(nullable = false)
//    String counselorId;
//
//    @Temporal(TemporalType.TIMESTAMP)
//    @Column(nullable = false)
//    Date appointmentDate;
//
//    @Column(nullable = false)
//    String timeSlot;
//}
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

    @ManyToOne
    @JoinColumn(name = "psychologist_id")
    private Psychologist psychologist;

    @Temporal(TemporalType.TIMESTAMP)
    Date appointmentDate;

    String timeSlot;

    private Boolean active;
    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}