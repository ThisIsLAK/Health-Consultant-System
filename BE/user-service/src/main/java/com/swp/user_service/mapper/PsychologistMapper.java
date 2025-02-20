package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.PsychologistCreationRequest;
//import com.swp.user_service.dto.request.PsychologistUpdateRequest;
import com.swp.user_service.dto.response.PsychologistResponse;
import com.swp.user_service.entity.Psychologist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PsychologistMapper {

    Psychologist toPsychologist(PsychologistCreationRequest request);

    PsychologistResponse toPsychologistResponse(Psychologist psychologist);

//    void updatePsychologist(@MappingTarget Psychologist psychologist, PsychologistUpdateRequest request);
}
