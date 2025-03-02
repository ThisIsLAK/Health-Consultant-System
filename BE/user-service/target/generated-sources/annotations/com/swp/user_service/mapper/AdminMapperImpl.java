package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.AdminRequest;
import com.swp.user_service.dto.response.AdminResponse;
import com.swp.user_service.entity.Admin;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class AdminMapperImpl implements AdminMapper {

    @Override
    public Admin toAdmin(AdminRequest request) {
        if ( request == null ) {
            return null;
        }

        Admin.AdminBuilder admin = Admin.builder();

        admin.name( request.getName() );
        admin.email( request.getEmail() );
        admin.password( request.getPassword() );

        return admin.build();
    }

    @Override
    public AdminResponse toAdminResponse(Admin admin) {
        if ( admin == null ) {
            return null;
        }

        AdminResponse.AdminResponseBuilder adminResponse = AdminResponse.builder();

        adminResponse.id( admin.getId() );
        adminResponse.name( admin.getName() );
        adminResponse.email( admin.getEmail() );
        adminResponse.password( admin.getPassword() );

        return adminResponse.build();
    }
}
