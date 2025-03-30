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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;


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
                .message("Register successfully. Check your email to verify.")
                .build();
    }

    @GetMapping("/verify-email")
    ApiResponse<String> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return ApiResponse.<String>builder()
                .result("Verify email successfully")
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

    @GetMapping("/allactiveappointments/{userId}")
    public ApiResponse<List<AppointmentResponse>> getAllActiveAppointments(@PathVariable String userId) {

        User userchecker = userRepository.findById(userId)
                .filter(user -> Objects.equals(user.getRole().getRoleId(), "2"))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_USER));

        List<AppointmentResponse> activeAppointments = userService.getAllActiveAppointments(userId);

        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(activeAppointments)
                .message("Active appointments retrieved successfully")
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

    @GetMapping("/supportprogram/{programCode}")
    public ApiResponse<SupportProgramResponse> getSupportProgramDetails(@PathVariable String programCode) {
        SupportProgramResponse response = supportProgramService.getSupportProgramDetails(programCode);
        return ApiResponse.<SupportProgramResponse>builder()
                .result(response)
                .message("Support program details retrieved successfully")
                .build();
    }

    @PostMapping("/signupprogram")
    public ApiResponse<SupportProgramResponse> signupForProgram(@RequestBody @Valid SupportProgramSignupRequest request) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.signupForProgram(request, request.getEmail()))
                .build();
    }

    @GetMapping("/mysupportprograms")
    public ApiResponse<List<SupportProgramResponse>> getUserSupportProgramHistory() {
        return ApiResponse.<List<SupportProgramResponse>>builder()
                .result(supportProgramService.getUserSupportProgramHistory())
                .message("Retrieved user's support program history successfully")
                .build();
    }

    /************************************************************
     *                  SURVEY CONTROLLER                       *
     ************************************************************/

    @PostMapping("/submit-answers")
    public ApiResponse<List<UserAnswerResponse>> submitUserAnswers(@RequestBody List<SubmitUserAnswerRequest> requests) {
        List<UserAnswerResponse> responses = userAnswerService.submitUserAnswers(requests);
        return ApiResponse.<List<UserAnswerResponse>>builder()
                .result(responses)
                .message("User answers submitted successfully")
                .build();
    }

    @GetMapping("/survey-result")
    public ApiResponse<SurveyResultResponse> getSurveyResult(@RequestParam String surveyId, @RequestParam String userId) {
        SurveyResultResponse result = userAnswerService.getSurveyResult(surveyId, userId);
        return ApiResponse.<SurveyResultResponse>builder()
                .result(result)
                .message("Survey result retrieved successfully")
                .build();
    }

    @GetMapping("/getallactivesurveys")
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

    @GetMapping("/getallactiveblogs")
    public ApiResponse<List<BlogResponse>> getAllActiveBlogs() {
        List<BlogResponse> blogs = blogService.getAllActiveBlogs();
        return ApiResponse.<List<BlogResponse>>builder()
                .result(blogs)
                .message("List of all active blogs retrieved successfully")
                .build();
    }

    @GetMapping("/blog/{blogCode}")
    public ApiResponse<BlogResponse> getBlogDetails(@PathVariable String blogCode) {
        BlogResponse blog = blogService.getBlogDetailsByCode(blogCode);
        return ApiResponse.<BlogResponse>builder()
                .result(blog)
                .message("Blog details retrieved successfully")
                .build();
    }

    @PostMapping("/sendEmailAppointment")
    public ApiResponse<Void> sendEmailAppointment(@RequestBody EmailAppointmentRequest emailRequest) {
        appointmentService.sendEmail(emailRequest);
        return ApiResponse.<Void>builder()
                .message("Email sent successfully")
                .build();
    }
}
