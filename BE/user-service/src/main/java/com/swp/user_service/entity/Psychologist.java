package com.swp.user_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Psychologist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "psy_id", length = 50)
    private String psyId;

    private String name;
    private String email;
    private String password;
    private String specialization;

    private Boolean active;
    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
    @OneToOne
    @JoinColumn(name = "psy_id", referencedColumnName = "user_id")
    private User user;

}

