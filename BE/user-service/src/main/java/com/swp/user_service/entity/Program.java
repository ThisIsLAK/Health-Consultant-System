package com.swp.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.util.List;

//@Entity
////@Table(name = "support_programs")
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE)
//public class Program {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    String programId;
//
//    String programName;
//
//    String description;
//
//    LocalDate startDate;
//
//    LocalDate endDate;
//
//    Integer registeredUsers;
//}

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String programId;

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
    private List<User> participants;
}
