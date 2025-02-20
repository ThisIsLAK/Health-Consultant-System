package com.swp.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import com.swp.user_service.entity.Program;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramResponse {
    String programId;
    String programName;
    public static ProgramResponse fromEntity(Program program) {
        return ProgramResponse.builder()
                .programId(program.getProgramId())
                .programName(program.getProgramName())
                .build();
    }
}
