package com.swp.user_service.service;

import com.swp.user_service.dto.request.UserCreationRequest;
import com.swp.user_service.dto.request.UserLoginRequest;
import com.swp.user_service.dto.request.UserUpdateRequest;
import com.swp.user_service.dto.response.UserLoginResponse;
import com.swp.user_service.entity.User;
import com.swp.user_service.repository.UserRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private static final Logger log = LogManager.getLogger(UserService.class);
    @Autowired
    private UserRepository userRepository ;

    public User createUser(UserCreationRequest request){
        User user = new User();

        if(userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email is existed");
        log.info("Testing gitignore");
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }

    public UserLoginResponse login(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate a mock token (you can replace this with JWT or similar)
        String token = generateToken(user.getId(), user.getEmail());

        return new UserLoginResponse(token, user.getName(), user.getEmail());
    }

    private String generateToken(String userId, String email) {
        return "token_" + userId + "_" + System.currentTimeMillis();
    }

    public User updateUser(String userId, UserUpdateRequest request){
        User user = getUser(userId);

        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User getUser(String userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(String userId){
        userRepository.deleteById(userId);
    }
}
