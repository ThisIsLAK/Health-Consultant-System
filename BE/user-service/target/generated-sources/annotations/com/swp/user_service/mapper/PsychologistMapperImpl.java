package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.PsychologistCreationRequest;
import com.swp.user_service.dto.response.PsychologistResponse;
import com.swp.user_service.entity.Psychologist;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class PsychologistMapperImpl implements PsychologistMapper {

    @Override
    public Psychologist toPsychologist(PsychologistCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Psychologist psychologist = new Psychologist();

        psychologist.setName( request.getName() );
        psychologist.setEmail( request.getEmail() );
        psychologist.setPassword( request.getPassword() );
        psychologist.setSpecialization( request.getSpecialization() );

        return psychologist;
    }

    @Override
    public PsychologistResponse toPsychologistResponse(Psychologist psychologist) {
        if ( psychologist == null ) {
            return null;
        }

        PsychologistResponse.PsychologistResponseBuilder psychologistResponse = PsychologistResponse.builder();

        psychologistResponse.id( psychologist.getId() );
        psychologistResponse.name( psychologist.getName() );
        psychologistResponse.email( psychologist.getEmail() );
        psychologistResponse.specialization( psychologist.getSpecialization() );

        return psychologistResponse.build();
    }
}
