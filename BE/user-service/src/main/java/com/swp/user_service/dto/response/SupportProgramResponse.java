package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportProgramResponse {
    String programCode;
    String programName;
    String description;
    LocalDate startDate;
    LocalDate endDate;
    Integer registeredUsers;
    List<UserResponse> participants;
    Boolean active;
}