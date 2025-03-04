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
    String name;
    String email;
    String password;
    Boolean active;
    Role role;
}
