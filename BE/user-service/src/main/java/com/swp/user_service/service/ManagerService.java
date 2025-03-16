package com.swp.user_service.service;

import com.swp.user_service.dto.response.DashboardResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ManagerService {

    AppointmentService appointmentService;
    SupportProgramService supportProgramService;
    SurveyService surveyService;
    public DashboardResponse getDashboardData() {
        DashboardResponse response = new DashboardResponse();
        response.setAppointmentSummary(appointmentService.getAppointmentSummary());
        response.setSupportProgramSummary(supportProgramService.getSupportProgramSummary());
        response.setSurveySummary(surveyService.getSurveySummary());
        return response;
    }
}
