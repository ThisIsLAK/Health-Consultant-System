package com.swp.user_service.controller;

import com.swp.user_service.dto.request.*;
import com.swp.user_service.dto.response.*;
import com.swp.user_service.entity.User;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.repository.UserRepository;
import com.swp.user_service.service.*;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {

    UserService userService;

    AppointmentService appointmentService;

    UserRepository userRepository;

    SupportProgramService supportProgramService;

    UserAnswerService userAnswerService;

    SurveyService surveyService;

    BlogService blogService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }


    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @GetMapping("/finduserbyid/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @PutMapping("/updateuser/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    @PostMapping("/bookappointment")
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @RequestBody @Valid AppointmentRequest request) {
        AppointmentResponse response = appointmentService.bookAppointment(request);

        return ResponseEntity.ok(ApiResponse.<AppointmentResponse>builder()
                .result(response)
                .build());
    }


    @DeleteMapping("/cancelappointment/{appointmentId}")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @PathVariable String appointmentId) {
        appointmentService.cancelAppointment(appointmentId);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Appointment cancelled successfully")
                .build());
    }

    @GetMapping("/appointmenthistory/{userId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getMyAppointments(@PathVariable("userId") String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXIST));

        List<AppointmentResponse> appointments = userService.getAppointmentHistory(userId);

        return ResponseEntity.ok(ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .build());
    }

    @GetMapping("/active-support-programs")
    public ApiResponse<List<SupportProgramResponse>> getAllActiveSupportPrograms() {
        return ApiResponse.<List<SupportProgramResponse>>builder()
                .result(supportProgramService.getAllActiveSupportPrograms())
                .build();
    }
    
    @GetMapping("/findsupportprogrambycode/{programCode}")
    public ApiResponse<SupportProgramResponse> findBySupportProgramCode(@PathVariable String programCode) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.findByProgramCode(programCode))
                .build();
    }

    @PostMapping("/signupprogram")
    public ApiResponse<SupportProgramResponse> signupForProgram(@RequestBody @Valid SupportProgramSignupRequest request) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.signupForProgram(request, request.getEmail()))
                .build();
    }

    @PostMapping("/submituseranswer")
    public ResponseEntity<UserAnswerResponse> submitUserAnswer(@RequestBody SubmitUserAnswerRequest request) {
        UserAnswerResponse answer = userAnswerService.submitUserAnswer(request);
        return ResponseEntity.ok(answer);
    }

    @GetMapping("/allsurveys")
    public ResponseEntity<List<AllSurveyResponse>> getAllSurveys() {
        List<AllSurveyResponse> surveys = surveyService.getAllSurveys();
        return ResponseEntity.ok(surveys);
    }

    @GetMapping("/takesurvey/{surveyId}")
    ApiResponse<SurveyResponse> getSurvey(@PathVariable String surveyId) {
        SurveyResponse survey = surveyService.getSurvey(surveyId);
        return ApiResponse.<SurveyResponse>builder()
                .message("Survey retrieved successfully with ID: " + surveyId)
                .result(survey)
                .build();
    }


    @GetMapping("/getblogbycode/{blogCode}")
    public ResponseEntity<BlogResponse> getBlogByBlogCode(@PathVariable String blogCode) {
        BlogResponse blog = blogService.getBlogByBlogCode(blogCode);
        return ResponseEntity.ok(blog);
    }

    @GetMapping("/getallblogs")
    public ResponseEntity<List<BlogResponse>> getAllBlogs() {
        List<BlogResponse> blogs = blogService.getAllBlogs();
        return ResponseEntity.ok(blogs);
    }
}
