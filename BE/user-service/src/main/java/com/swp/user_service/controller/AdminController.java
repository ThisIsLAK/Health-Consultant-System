package com.swp.user_service.controller;

import com.swp.user_service.dto.request.*;
import com.swp.user_service.dto.response.*;
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

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminController {
    @Autowired
    private AdminService adminService;
    @Autowired
    private UserService userService;
    @Autowired
    private SupportProgramService supportProgramService;
    @Autowired
    private BlogService blogService;
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private SurveyService surveyService;
    @Autowired
    private SurveyQuestionService surveyQuestionService;

    @DeleteMapping("/deleteuserbyid/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted with ID:"+ " " + userId).build();
    }

    @GetMapping("/getAllUser")
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(adminService.getUsers())
                .build();
    }

    @GetMapping("/finduserbyemail/{email}")
    ApiResponse<UserResponse> getUserByEmail(@PathVariable("email") String email) {
        return ApiResponse.<UserResponse>builder()
                .result(adminService.getUserByEmail(email))
                .build();
    }

    @PutMapping("/resetUserPassword/{email}")
    ApiResponse<UserResponse> resetUserPassword(@PathVariable String email, @RequestBody ResetPasswordRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(adminService.resetUserPassword(email, request))
                .build();
    }

    @PutMapping("/updateUser/{email}")
    ApiResponse<UserResponse> updateUserByAdmin(@PathVariable String email, @RequestBody UserUpdateByAdminRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(adminService.updateUserByAdmin(email, request))
                .build();
    }


    @PostMapping("/createUserByAdmin")
    public ResponseEntity<ApiResponse<UserResponse>> createUserByAdmin(
            @RequestBody @Valid UserCreationRequest request) {

        UserResponse userResponse = adminService.createUserByAdmin(request);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .result(userResponse)
                .message("User created successfully")
                .build());
    }

    //program controller=================================================================================================
    @PostMapping("/createsupportprogram")
    public ApiResponse<SupportProgramResponse> createSupportProgram(@RequestBody @Valid SupportProgramRequest request) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.createSupportProgram(request))
                .build();
    }

    @PutMapping("/updateprogrambycode/{programCode}")
    public ApiResponse<SupportProgramResponse> updateSupportProgram(@PathVariable String programCode, @RequestBody @Valid SupportProgramRequest request) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.updateSupportProgram(programCode, request))
                .build();
    }

    @DeleteMapping("/deleteprogrambycode/{programCode}")
    public ApiResponse<String> deleteSupportProgram(@PathVariable String programCode) {
        supportProgramService.deleteSupportProgram(programCode);
        return ApiResponse.<String>builder()
                .message("Delete successfully")
                .build();
    }

    @GetMapping("/getallprograms")
    public ApiResponse<List<SupportProgramResponse>> getAllSupportPrograms() {
        return ApiResponse.<List<SupportProgramResponse>>builder()
                .result(supportProgramService.getAllSupportPrograms())
                .build();
    }
    @GetMapping("/findprogrambycode/{programCode}")
    public ApiResponse<SupportProgramResponse> findBySupportProgramCode(@PathVariable String programCode) {
        return ApiResponse.<SupportProgramResponse>builder()
                .result(supportProgramService.findByProgramCode(programCode))
                .build();
    }
    //blog controller=================================================================================================
    @PostMapping("/createblog")
    public ResponseEntity<BlogResponse> createBlog(@RequestBody BlogRequest request) {
        BlogResponse createdBlog = blogService.createBlog(request);
        return ResponseEntity.ok(createdBlog);
    }

    @PutMapping("/updateblogbycode/{blogCode}")
    public ResponseEntity<BlogResponse> updateBlog(@PathVariable String blogCode, @RequestBody BlogRequest request) {
        BlogResponse updatedBlog = blogService.updateBlog(blogCode, request);
        return ResponseEntity.ok(updatedBlog);
    }

    @DeleteMapping("/deleteblogbycode/{blogCode}")
    public ResponseEntity<Void> deleteBlog(@PathVariable String blogCode) {
        blogService.deleteBlog(blogCode);
        return ResponseEntity.noContent().build();
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
    //appointment controller=================================================================================================
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @PathVariable String appointmentId) {
        appointmentService.cancelAppointment(appointmentId);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Appointment cancelled successfully")
                .build());
    }
    //psychologist
    @GetMapping("/viewpsychologistapointmentlist/{psychologistId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getPsychologistAppointments(
            @PathVariable String psychologistId) {
        List<AppointmentResponse> appointments = appointmentService.getPsychologistAppointments(psychologistId);

        return ResponseEntity.ok(ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .build());
    }
    //user
    @GetMapping("/viewuserappointmentlist/{userId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getUserAppointments(
            @PathVariable String userId) {
        List<AppointmentResponse> appointments = appointmentService.getUserAppointments(userId);

        return ResponseEntity.ok(ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .build());
    }
    @GetMapping("/allappointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAllAppointments() {

        List<AppointmentResponse> appointments = appointmentService.getAllAppointments();

        return ResponseEntity.ok(ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .build());
    }
    //survey controller=================================================================================================
    @PostMapping("/createsurvey")
    public ResponseEntity<SurveyResponse> createSurvey(@RequestBody SurveyCreationRequest request) {
        SurveyResponse survey = surveyService.createSurvey(request);
        return ResponseEntity.ok(survey);
    }

    @GetMapping("/allsurveys")
    public ResponseEntity<List<AllSurveyResponse>> getAllSurveys() {
        List<AllSurveyResponse> surveys = surveyService.getAllSurveys();
        return ResponseEntity.ok(surveys);
    }

    @GetMapping("/findsurveybyid/{surveyId}")
    ApiResponse<SurveyResponse> getSurvey(@PathVariable String surveyId) {
        SurveyResponse survey = surveyService.getSurvey(surveyId);
        return ApiResponse.<SurveyResponse>builder()
                .message("Survey retrieved successfully with ID: " + surveyId)
                .result(survey)
                .build();
    }

    @PostMapping("/createsurveyquestion")
    public ResponseEntity<SurveyQuestionResponse> createSurveyQuestion(@RequestBody SurveyQuestionCreationRequest request) {
        SurveyQuestionResponse question = surveyQuestionService.createSurveyQuestion(request);
        return ResponseEntity.ok(question);
    }

    @GetMapping("/findsurveyquestionbyid/{questionId}")
    public ResponseEntity<SurveyQuestionResponse> getSurveyQuestion(@PathVariable String questionId) {
        SurveyQuestionResponse question = surveyQuestionService.getSurveyQuestion(questionId);
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/delete-survey-by-surveyid/{surveyId}")
    ApiResponse<String> deleteSurvey(@PathVariable String surveyId) {
        surveyService.deleteSurveyById(surveyId);
        return ApiResponse.<String>builder()
                .message("Survey deleted successfully with ID: " + surveyId)
                .build();
    }

    @PutMapping("/update-survey/{surveyId}")
    ApiResponse<SurveyResponse> updateSurvey(
            @PathVariable String surveyId,
            @RequestBody @Valid SurveyUpdateRequest request) {

        SurveyResponse updatedSurvey = surveyService.updateSurvey(surveyId, request);
        return (ApiResponse.<SurveyResponse>builder()
                .message("Survey updated successfully with ID: " + surveyId)
                .result(surveyService.updateSurvey(surveyId, request))
                .build());
    }

    @PutMapping("/update-survey-question/{questionId}")
    ApiResponse<SurveyQuestionResponse> updateSurveyQuestion(
            @PathVariable String questionId,
            @RequestBody @Valid SurveyQuestionCreationRequest request) {

        SurveyQuestionResponse updatedQuestion = surveyQuestionService.updateSurveyQuestion(questionId, request);
        return ApiResponse.<SurveyQuestionResponse>builder()
                .message("Survey question updated successfully with ID: " + questionId)
                .result(updatedQuestion)
                .build();
    }

    @DeleteMapping("/delete-survey-question/{questionId}")
    ApiResponse<String> deleteSurveyQuestion(@PathVariable String questionId) {
        surveyQuestionService.deleteSurveyQuestion(questionId);
        return ApiResponse.<String>builder()
                .message("Survey question deleted successfully with ID: " + questionId)
                .build();
    }

}
