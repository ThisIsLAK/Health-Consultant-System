package com.swp.user_service.dto.response;


import com.swp.user_service.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String name;
    String email;
    Boolean active;
    Role role;
}
