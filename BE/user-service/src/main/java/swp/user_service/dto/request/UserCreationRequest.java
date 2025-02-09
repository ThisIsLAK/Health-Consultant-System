package swp.user_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserCreationRequest {

    @Size(min = 8, message = "USERNAME_INVALID")
    private String username;
    
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@gmail.com", message = "EMAIL_INVALID")
    private String email;

    @Size(min = 8, message = "PASSWORD_INVALID")
    private String password;

    public UserCreationRequest() {
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}