package com.swp.user_service.controller;

import com.nimbusds.jose.JOSEException;
import com.swp.user_service.dto.request.AuthenticationRequest;
import com.swp.user_service.dto.request.IntrospectRequest;
import com.swp.user_service.dto.request.LogoutRequest;
import com.swp.user_service.dto.response.ApiResponse;
import com.swp.user_service.dto.response.AuthenticationResponse;
import com.swp.user_service.dto.response.IntrospectResponse;
import com.swp.user_service.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    //Day la controller dung de login
    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestHeader("Authorization") String authorizationHeader) throws ParseException, JOSEException {
        authenticationService.logout(authorizationHeader);
        return ApiResponse.<Void>builder()
                .message("Logout successfully")
                .build();
    }

}
