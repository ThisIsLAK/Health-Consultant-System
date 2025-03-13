package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.UserCreationRequest;
import com.swp.user_service.dto.request.UserUpdateRequest;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(UserCreationRequest request);
    @Mapping(source = "active", target = "active")
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
