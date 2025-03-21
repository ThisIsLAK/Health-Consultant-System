package com.swp.user_service.mapper;

import com.swp.user_service.dto.request.SurveyAnswerOptionRequest;
import com.swp.user_service.dto.request.SurveyAnswerOptionUpdateRequest;
import com.swp.user_service.entity.SurveyAnswerOption;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class SurveyAnswerOptionMapperImpl implements SurveyAnswerOptionMapper {

    @Override
    public SurveyAnswerOption toSurveyAnswerOption(SurveyAnswerOptionRequest request) {
        if ( request == null ) {
            return null;
        }

        SurveyAnswerOption.SurveyAnswerOptionBuilder surveyAnswerOption = SurveyAnswerOption.builder();

        surveyAnswerOption.optionText( request.getOptionText() );
        surveyAnswerOption.score( request.getScore() );
        surveyAnswerOption.active( request.getActive() );

        return surveyAnswerOption.build();
    }

    @Override
    public SurveyAnswerOption toSurveyAnswerOption(SurveyAnswerOptionUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        SurveyAnswerOption.SurveyAnswerOptionBuilder surveyAnswerOption = SurveyAnswerOption.builder();

        surveyAnswerOption.optionId( request.getOptionId() );
        surveyAnswerOption.optionText( request.getOptionText() );
        surveyAnswerOption.score( request.getScore() );
        surveyAnswerOption.active( request.getActive() );

        return surveyAnswerOption.build();
    }
}
