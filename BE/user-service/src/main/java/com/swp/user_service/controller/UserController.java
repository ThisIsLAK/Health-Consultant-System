package com.swp.user_service.controller;

import com.swp.user_service.dto.request.*;
import com.swp.user_service.dto.response.*;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.repository.UserRepository;
import com.swp.user_service.service.*;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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
    PsyService psyService;
    AppointmentService appointmentService;
    UserRepository userRepository;
    SupportProgramService supportProgramService;
    UserAnswerService userAnswerService;
    SurveyService surveyService;
    BlogService blogService;



    /************************************************************
     *                  USER CONTROLLER                         *
     ************************************************************/

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

    /************************************************************
     *                  PSYCHOLOGIST CONTROLLER                 *
     ************************************************************/

    @GetMapping("/allpsy")
    public ApiResponse<List<UserResponse>> getAllPsychologists() {
        List<UserResponse> psychologists = psyService.getAllPsychologists();
        return ApiResponse.<List<UserResponse>>builder()
                .result(psychologists)
                .message("List of all psychologists retrieved successfully")
                .build();
    }

    @GetMapping("/findpsybyid/{id}")
    public ApiResponse<UserResponse> getPsychologistById(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .result(psyService.getPsychologistById(id))
                .build();
    }

    /************************************************************
     *                  APPOINTMENT CONTROLLER                  *
     ************************************************************/

    @PostMapping("/bookappointment")
    public ApiResponse<AppointmentResponse> bookAppointment(@RequestBody @Valid AppointmentRequest request) {
        AppointmentResponse response = appointmentService.bookAppointment(request);

        return ApiResponse.<AppointmentResponse>builder()
                .result(response)
                .message("Appointment booked successfully")
                .build();
    }


    @DeleteMapping("/cancelappointment/{appointmentId}")
    public ApiResponse<Void> cancelAppointment(@PathVariable String appointmentId) {
        appointmentService.cancelAppointment(appointmentId);

        return ApiResponse.<Void>builder()
                .message("Appointment cancelled successfully")
                .build();
    }

    @GetMapping("/appointmenthistory/{userId}")
    public ApiResponse<List<AppointmentResponse>> getMyAppointments(@PathVariable("userId") String userId) {
        // Kiểm tra xem người dùng có tồn tại không
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_EXIST);
        }

        // Lấy lịch sử đặt lịch
        List<AppointmentResponse> appointments = userService.getAppointmentHistory(userId);

        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .message("Appointment history retrieved successfully")
                .build();
    }

    /************************************************************
     *                  SUPPORT PROGRAM CONTROLLER              *
     ************************************************************/

    @GetMapping("/allsupportprogramsactive")
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

    /************************************************************
     *                  SURVEY CONTROLLER                       *
     ************************************************************/

    @PostMapping("/submituseranswer")
    public ApiResponse<UserAnswerResponse> submitUserAnswer(@RequestBody SubmitUserAnswerRequest request) {
        UserAnswerResponse answer = userAnswerService.submitUserAnswer(request);
        return ApiResponse.<UserAnswerResponse>builder()
                .result(answer)
                .message("User answer submitted successfully")
                .build();
    }

    @GetMapping("/allsurveys")
    public ApiResponse<List<AllSurveyResponse>> getAllSurveys() {
        List<AllSurveyResponse> surveys = surveyService.getAllSurveys();
        return ApiResponse.<List<AllSurveyResponse>>builder()
                .result(surveys)
                .message("List of all surveys retrieved successfully")
                .build();
    }

    @GetMapping("/takesurvey/{surveyId}")
    ApiResponse<SurveyResponse> getSurvey(@PathVariable String surveyId) {
        SurveyResponse survey = surveyService.getSurvey(surveyId);
        return ApiResponse.<SurveyResponse>builder()
                .message("Survey retrieved successfully with ID: " + surveyId)
                .result(survey)
                .build();
    }

    /************************************************************
     *                  BLOG CONTROLLER                         *
     ************************************************************/

    @GetMapping("/getblogbycode/{blogCode}")
    public ApiResponse<BlogResponse> getBlogByBlogCode(@PathVariable String blogCode) {
        BlogResponse blog = blogService.getBlogByBlogCode(blogCode);
        return ApiResponse.<BlogResponse>builder()
                .result(blog)
                .message("Blog retrieved successfully")
                .build();
    }

    @GetMapping("/getallblogs")
    public ApiResponse<List<BlogResponse>> getAllBlogs() {
        List<BlogResponse> blogs = blogService.getAllBlogs();
        return ApiResponse.<List<BlogResponse>>builder()
                .result(blogs)
                .message("List of all blogs retrieved successfully")
                .build();
    }
}
