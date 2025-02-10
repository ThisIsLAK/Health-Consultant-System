package swp.user_service.controller;

import jakarta.validation.Valid;
import swp.user_service.dto.request.ApiResponse;
import swp.user_service.dto.request.UserCreationRequest;
import swp.user_service.dto.request.UserLoginRequest;
import swp.user_service.dto.request.UserUpdateRequest;
import swp.user_service.entity.User;
import swp.user_service.service.UserService;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:5175")
@RestController
@RequestMapping({"/users"})
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    User createUser(@RequestBody @Valid UserCreationRequest request) {

//        ApiResponse<User> apiResponse = new ApiResponse<>();
////
////        apiResponse.setResult(userService.createUser(request));
////        return apiResponse;
        return userService.createUser(request);
    }

    @PostMapping("/login")
    User loginUser(@RequestBody UserLoginRequest request) {
        return userService.authenticateUser(request.getEmail(), request.getPassword());
    }

    @GetMapping
    List<User> getUsers() {
        return this.userService.getUsers();
    }

    @GetMapping({"/{userId}"})
    User getUser(@PathVariable("userId") String userId) {
        return this.userService.getUser(userId);
    }

    @PutMapping({"/{userId}"})
    User updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return this.userService.updateUser(userId, request);
    }

    @DeleteMapping({"/{userId}"})
    String deleteUser(@PathVariable String userId) {
        this.userService.deleteUser(userId);
        return "User has been deleted";
    }
}
