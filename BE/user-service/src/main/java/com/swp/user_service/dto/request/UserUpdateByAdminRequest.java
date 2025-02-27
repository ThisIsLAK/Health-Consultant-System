package com.swp.user_service.dto.request;

import com.swp.user_service.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateByAdminRequest {
    private String name;
    private String email;
    private String password;
    private Boolean active;
    Role role;
}
