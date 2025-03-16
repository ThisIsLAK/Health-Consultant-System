package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportProgramSummaryResponse {
    private Long totalPrograms;
    private Long activePrograms;
    private Long totalParticipants;
    private Long programsEndingSoon;
}
