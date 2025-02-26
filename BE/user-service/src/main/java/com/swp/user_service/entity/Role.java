package com.swp.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.List;

//@Entity
//@Table(name = "Role")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Role {
//    @Id
//    @Column(name = "role_id", length = 50)
//    private String roleId;
//
//    @Column(name = "role_name", nullable = false, length = 50)
//    private String roleName;
//
//    @Column(name = "description")
//    private String description;
//}

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @Column(name = "role_id", length = 50)
    private String roleId;

    @Column(name = "role_name", nullable = false, length = 50)
    private String roleName;

    private String description;

    private Boolean active;
    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
    }

//    @OneToMany(mappedBy = "role")
//    private List<User> users;
}
