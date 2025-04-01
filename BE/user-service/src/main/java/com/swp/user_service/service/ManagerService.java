package com.swp.user_service.service;

import com.swp.user_service.dto.response.DashboardResponse;
import com.swp.user_service.dto.response.UserSummaryResponse;
import com.swp.user_service.entity.User;
import com.swp.user_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ManagerService {

    AppointmentService appointmentService;
    SupportProgramService supportProgramService;
    SurveyService surveyService;
    UserRepository userRepository;

    public DashboardResponse getDashboardData() {
        DashboardResponse response = new DashboardResponse();
        response.setAppointmentSummary(appointmentService.getAppointmentSummary());
        response.setSupportProgramSummary(supportProgramService.getSupportProgramSummary());
        response.setSurveySummary(surveyService.getSurveySummary());
        return response;
    }

    public List<UserSummaryResponse> getActiveUsersByRoleId(String roleId) {
        List<User> users = userRepository.findByRole_RoleIdAndActive(roleId, true);
        return users.stream()
                .map(user -> new UserSummaryResponse(user.getName(), user.getEmail(), user.getActive()))
                .collect(Collectors.toList());
    }
}
