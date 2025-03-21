package com.swp.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.util.List;


@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String programId;

    String programCode;
    String programName;
    String description;
    LocalDate startDate;
    LocalDate endDate;
    Integer registeredUsers;

    @ManyToMany
    @JoinTable(
            name = "program_participation",
            joinColumns = @JoinColumn(name = "program_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    List<User> participants;
    Boolean active;

    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }
}
