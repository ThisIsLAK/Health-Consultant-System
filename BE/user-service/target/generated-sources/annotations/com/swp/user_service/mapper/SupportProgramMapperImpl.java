package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SupportProgramRequest;
import com.swp.user_service.dto.response.SupportProgramResponse;
import com.swp.user_service.entity.SupportProgram;
import com.swp.user_service.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class SupportProgramMapperImpl implements SupportProgramMapper {

    @Override
    public SupportProgram toEntity(SupportProgramRequest request) {
        if ( request == null ) {
            return null;
        }

        SupportProgram.SupportProgramBuilder supportProgram = SupportProgram.builder();

        supportProgram.programCode( request.getProgramCode() );
        supportProgram.programName( request.getProgramName() );
        supportProgram.description( request.getDescription() );
        supportProgram.startDate( request.getStartDate() );
        supportProgram.endDate( request.getEndDate() );
        supportProgram.active( request.getActive() );

        return supportProgram.build();
    }

    @Override
    public SupportProgramResponse toResponse(SupportProgram supportProgram) {
        if ( supportProgram == null ) {
            return null;
        }

        SupportProgramResponse.SupportProgramResponseBuilder supportProgramResponse = SupportProgramResponse.builder();

        supportProgramResponse.participants( mapParticipants( supportProgram.getParticipants() ) );
        supportProgramResponse.programCode( supportProgram.getProgramCode() );
        supportProgramResponse.programName( supportProgram.getProgramName() );
        supportProgramResponse.description( supportProgram.getDescription() );
        supportProgramResponse.startDate( supportProgram.getStartDate() );
        supportProgramResponse.endDate( supportProgram.getEndDate() );
        supportProgramResponse.active( supportProgram.getActive() );

        supportProgramResponse.registeredUsers( supportProgram.getParticipants() != null ? supportProgram.getParticipants().size() : 0 );

        return supportProgramResponse.build();
    }

    @Override
    public void updateSupportProgramFromRequest(SupportProgramRequest request, SupportProgram supportProgram) {
        if ( request == null ) {
            return;
        }

        supportProgram.setProgramCode( request.getProgramCode() );
        supportProgram.setProgramName( request.getProgramName() );
        supportProgram.setDescription( request.getDescription() );
        supportProgram.setStartDate( request.getStartDate() );
        supportProgram.setEndDate( request.getEndDate() );
        supportProgram.setActive( request.getActive() );
    }

    @Override
    public void updateSupportProgramForSignup(User user, SupportProgram supportProgram) {
        if ( user == null ) {
            return;
        }

        supportProgram.setActive( user.getActive() );
    }
}
