package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SupportProgramRequest;
import com.swp.user_service.dto.response.SupportProgramResponse;
import com.swp.user_service.dto.response.UserResponse;
import com.swp.user_service.entity.Role;
import com.swp.user_service.entity.SupportProgram;
import com.swp.user_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper
public interface SupportProgramMapper {
    SupportProgramMapper INSTANCE = Mappers.getMapper(SupportProgramMapper.class);

    SupportProgram toEntity(SupportProgramRequest request);

    @Mapping(target = "registeredUsers", expression = "java(supportProgram.getParticipants() != null ? supportProgram.getParticipants().size() : 0)")
    @Mapping(target = "participants", source = "participants", qualifiedByName = "mapParticipants")
    SupportProgramResponse toResponse(SupportProgram supportProgram);

    void updateSupportProgramFromRequest(SupportProgramRequest request, @MappingTarget SupportProgram supportProgram);

    void updateSupportProgramForSignup(User user, @MappingTarget SupportProgram supportProgram);

    @Named("mapParticipants")
    default List<UserResponse> mapParticipants(List<User> participants) {
        return participants != null ? participants.stream()
                .map(user -> new UserResponse(user.getId(), user.getName(), user.getEmail(), Role.builder().build()))
                .collect(Collectors.toList()) : null;
    }
}
