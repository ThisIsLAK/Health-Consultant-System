package com.swp.user_service.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.swp.user_service.dto.request.AuthenticationRequest;
import com.swp.user_service.dto.request.IntrospectRequest;
import com.swp.user_service.dto.request.LogoutRequest;
import com.swp.user_service.dto.response.AuthenticationResponse;
import com.swp.user_service.dto.response.IntrospectResponse;
import com.swp.user_service.entity.InvalidatedToken;
import com.swp.user_service.entity.User;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.repository.InvalidatedTokenRepository;
import com.swp.user_service.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Set;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_EXIST));

        boolean authenticated = passwordEncoder.matches(request.getPassword(),
                user.getPassword());

        if(!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .userId(user.getId())
                .build();
    }

    //Build thong tin cua 1 token
    //De tao 1 token thi chung ta can co header, body( chua nhung noi dung chung ta
    //gui di trong token
    private String generateToken(User user) {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        //Thong tin co ban de build 1 token
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer(user.getId())
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString()) //JWT ID cho login token
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        //Ki 1 token
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token");
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (user.getRole() != null) {
            stringJoiner.add(user.getRole().getRoleName());
        }

        return stringJoiner.toString();
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    public void logout(String authorizationHeader) throws ParseException, JOSEException {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        log.info("Authorization header received: {}", authorizationHeader);

        try {
            String token = authorizationHeader.substring(7); // Loại bỏ "Bearer "
            var signToken = verifyToken(token);
            log.info("JWT Claims: {}", signToken.getJWTClaimsSet().toJSONObject());

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();
            if (jit == null) {
                log.error("JWT ID is null, cannot invalidate token");
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();
            log.info("Invalidated token saved with ID: {}", jit);

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException exception) {
            log.info("Token already expired");
            throw exception;
        }
    }

    private SignedJWT verifyToken(String token) throws ParseException, JOSEException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        log.info("Parsing JWT token: {}", token);
        SignedJWT signedJWT = SignedJWT.parse(token);
        log.info("JWT parsed successfully");

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);
        log.info("Verifying token: {}", token);

        if (!(verified && expiryTime.after(new Date()))) {
            log.error("Token is invalid or expired: verified={}, expiryTime={}", verified, expiryTime);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String jwtID = signedJWT.getJWTClaimsSet().getJWTID();
        boolean exists = invalidatedTokenRepository.existsById(jwtID);
        log.info("Checking if token exists in invalidated list: {}", exists);

        if (exists)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }
}
