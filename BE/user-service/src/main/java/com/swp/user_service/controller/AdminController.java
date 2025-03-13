package com.swp.user_service.controller;

import com.swp.user_service.dto.request.*;
import com.swp.user_service.dto.response.*;
import com.swp.user_service.service.*;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminController {

    AdminService adminService;

    UserService userService;

    SupportProgramService supportProgramService;

    BlogService blogService;

    AppointmentService appointmentService;

    SurveyService surveyService;

    SurveyQuestionService surveyQuestionService;

    /************************************************************
     *                  USER CONTROLLER                         *
     ************************************************************/
    @DeleteMapping("/deleteuserbyid/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted with ID:" + " " + userId).build();
    }

    @GetMapping("/getAllActiveUser")
    ApiResponse<List<UserResponse>> getAllUserByActive() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(adminService.getAllUserByActive())
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
    public ApiResponse<UserResponse> createUserByAdmin(@RequestBody @Valid UserCreationRequest request) {
        UserResponse userResponse = adminService.createUserByAdmin(request);
        return ApiResponse.<UserResponse>builder()
                .result(userResponse)
                .message("User created successfully")
                .build();
    }

    /************************************************************
     *                  SUPPORT PROGRAM CONTROLLER              *
     ************************************************************/

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

    /************************************************************
     *                  BLOG CONTROLLER                         *
     ************************************************************/

    @PostMapping("/createblog")
    public ApiResponse<BlogResponse> createBlog(@RequestBody BlogRequest request) {
        BlogResponse createdBlog = blogService.createBlog(request);
        return ApiResponse.<BlogResponse>builder()
                .result(createdBlog)
                .message("Blog created successfully")
                .build();
    }

    @PutMapping("/updateblogbycode/{blogCode}")
    public ApiResponse<BlogResponse> updateBlog(@PathVariable String blogCode, @RequestBody BlogRequest request) {
        BlogResponse updatedBlog = blogService.updateBlog(blogCode, request);
        return ApiResponse.<BlogResponse>builder()
                .result(updatedBlog)
                .message("Blog updated successfully")
                .build();
    }

    @DeleteMapping("/deleteblogbycode/{blogCode}")
    public ApiResponse<Void> deleteBlog(@PathVariable String blogCode) {
        blogService.deleteBlog(blogCode);
        return ApiResponse.<Void>builder()
                .message("Blog deleted successfully")
                .build();
    }

    @GetMapping("/getblogbycode/{blogCode}")
    public ApiResponse<BlogResponse> getBlogByBlogCode(@PathVariable String blogCode) {
        BlogResponse blog = blogService.getBlogByBlogCode(blogCode);
        return ApiResponse.<BlogResponse>builder()
                .result(blog)
                .message("Blog retrieved successfully")
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
    /************************************************************
     *                  APPOINTMENT CONTROLLER                  *
     ************************************************************/

    @DeleteMapping("/cancelappointment/{appointmentId}")
    public ApiResponse<Void> cancelAppointment(@PathVariable String appointmentId) {
        appointmentService.cancelAppointment(appointmentId);

        return ApiResponse.<Void>builder()
                .message("Appointment cancelled successfully")
                .build();
    }

    @GetMapping("/psyappointment/{psychologistId}")
    public ApiResponse<List<AppointmentResponse>> getPsychologistAppointments(@PathVariable String psychologistId) {

        List<AppointmentResponse> appointments = appointmentService.getPsychologistAppointments(psychologistId);

        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .message("Psychologist appointments retrieved successfully")
                .build();
    }

    @GetMapping("/viewuserappointmentlist/{id}")
    public ApiResponse<List<AppointmentResponse>> getUserAppointments(@PathVariable String id) {
        List<AppointmentResponse> appointments = appointmentService.getUserAppointments(id);

        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .message("User appointments retrieved successfully")
                .build();
    }

    @GetMapping("/allappointments")
    public ApiResponse<List<AppointmentResponse>> getAllAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAllAppointments();

        return ApiResponse.<List<AppointmentResponse>>builder()
                .result(appointments)
                .message("All appointments retrieved successfully")
                .build();
    }

    /************************************************************
     *                  SURVEY CONTROLLER                       *
     ************************************************************/

    @PostMapping("/createsurvey")
    public ApiResponse<SurveyResponse> createSurvey(@RequestBody SurveyCreationRequest request) {
        SurveyResponse survey = surveyService.createSurvey(request);
        return ApiResponse.<SurveyResponse>builder()
                .message("Survey created successfully")
                .result(survey)
                .build();
    }

    @GetMapping("/allsurveys")
    public ApiResponse<List<AllSurveyResponse>> getAllSurveys() {
        List<AllSurveyResponse> surveys = surveyService.getAllSurveys();
        return ApiResponse.<List<AllSurveyResponse>>builder()
                .message("All surveys retrieved successfully")
                .result(surveys)
                .build();
    }

    @GetMapping("/findsurveybyid/{surveyId}")
    public ApiResponse<SurveyResponse> getSurvey(@PathVariable String surveyId) {
        SurveyResponse survey = surveyService.getSurvey(surveyId);
        return ApiResponse.<SurveyResponse>builder()
                .message("Survey retrieved successfully with ID: " + surveyId)
                .result(survey)
                .build();
    }

    @PostMapping("/createsurveyquestion")
    public ApiResponse<SurveyQuestionResponse> createSurveyQuestion(@RequestBody SurveyQuestionCreationRequest request) {
        SurveyQuestionResponse question = surveyQuestionService.createSurveyQuestion(request);
        return ApiResponse.<SurveyQuestionResponse>builder()
                .message("Survey question created successfully")
                .result(question)
                .build();
    }

    @GetMapping("/findsurveyquestionbyid/{questionId}")
    public ApiResponse<SurveyQuestionResponse> getSurveyQuestion(@PathVariable String questionId) {
        SurveyQuestionResponse question = surveyQuestionService.getSurveyQuestion(questionId);
        return ApiResponse.<SurveyQuestionResponse>builder()
                .message("Survey question retrieved successfully with ID: " + questionId)
                .result(question)
                .build();
    }

    @DeleteMapping("/deletesurveybysurveyid/{surveyId}")
    ApiResponse<String> deleteSurvey(@PathVariable String surveyId) {
        surveyService.deleteSurveyById(surveyId);
        return ApiResponse.<String>builder()
                .message("Survey deleted successfully with ID: " + surveyId)
                .build();
    }

    @PutMapping("/updatesurvey/{surveyId}")
    ApiResponse<SurveyResponse> updateSurvey(
            @PathVariable String surveyId,
            @RequestBody @Valid SurveyUpdateRequest request) {

        SurveyResponse updatedSurvey = surveyService.updateSurvey(surveyId, request);
        return (ApiResponse.<SurveyResponse>builder()
                .message("Survey updated successfully with ID: " + surveyId)
                .result(surveyService.updateSurvey(surveyId, request))
                .build());
    }

    @PutMapping("/updatesurveyquestion/{questionId}")
    ApiResponse<SurveyQuestionResponse> updateSurveyQuestion(
            @PathVariable String questionId,
            @RequestBody @Valid SurveyQuestionCreationRequest request) {

        SurveyQuestionResponse updatedQuestion = surveyQuestionService.updateSurveyQuestion(questionId, request);
        return ApiResponse.<SurveyQuestionResponse>builder()
                .message("Survey question updated successfully with ID: " + questionId)
                .result(updatedQuestion)
                .build();
    }

    @DeleteMapping("/deletesurveyquestion/{questionId}")
    ApiResponse<String> deleteSurveyQuestion(@PathVariable String questionId) {
        surveyQuestionService.deleteSurveyQuestion(questionId);
        return ApiResponse.<String>builder()
                .message("Survey question deleted successfully with ID: " + questionId)
                .build();
    }
}
