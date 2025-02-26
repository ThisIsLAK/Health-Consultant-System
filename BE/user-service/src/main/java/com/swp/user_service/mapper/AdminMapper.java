package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.AdminRequest;
import com.swp.user_service.dto.response.AdminResponse;
import com.swp.user_service.entity.Admin;

public interface AdminMapper {
    Admin toAdmin(AdminRequest request);

    AdminResponse toAdminResponse(Admin admin);
}
