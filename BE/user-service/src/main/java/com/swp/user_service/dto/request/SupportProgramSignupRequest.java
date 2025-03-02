package com.swp.user_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SupportProgramSignupRequest {
    @NotNull
    private String programCode;

    @NotNull
    private String email;
}