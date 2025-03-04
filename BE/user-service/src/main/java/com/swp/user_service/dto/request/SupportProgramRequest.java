package com.swp.user_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportProgramRequest {

    @NotNull
    String programCode;

    @NotNull
    String programName;

    @NotNull
    String description;

    @NotNull
    LocalDate startDate;

    @NotNull
    LocalDate endDate;

    Boolean active;
}