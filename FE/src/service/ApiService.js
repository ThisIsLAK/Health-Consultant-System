import axios from "axios";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    /**AUTh && USERS API */
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/identity/users`, registration)
        return response.data;
    }

    static async loginUser(loginDetails) {
        try {
            const response = await axios.post(`${this.BASE_URL}/identity/auth/token`, loginDetails);
            if (response && response.data) {
                // Store token immediately when login is successful
                if (response.data.token) {
                    localStorage.setItem("token", response.data.token);
                    // Add this line to fix the login issue
                    console.log("Token stored:", response.data.token);
                }
                
                return {
                    status: 200,
                    data: response.data,
                };
            } else {
                return {
                    status: 400,
                    message: "Invalid response",
                };
            }
        } catch (error) {
            return {
                status: 400,
                message: error.message || "Login failed",
            };
        }
    }

    static async getLoggedInUserInfo() {
        try {
            const response = await axios.get(`${this.BASE_URL}/identity/users/myInfo`, {
                headers: this.getHeader()
            });
            
            console.log("User info response:", response.data);
            return {
                status: 200,
                data: response.data
            };
        } catch (error) {
            console.error("Error fetching user info:", error);
            return {
                status: 400,
                message: error.response?.data?.message || error.message || "Failed to fetch user info"
            };
        }
    }
    
    static async updateUserProfile(userData) {
        try {
            if (!userData.id) {
                throw new Error("User ID is required for profile update");
            }
            
            // Log the request details for debugging
            console.log("Update user data:", userData);
            console.log("Updating user with ID:", userData.id);
            
            // Using the userId from userData.id for the endpoint
            const response = await axios.put(
                `${this.BASE_URL}/identity/users/${userData.id}`, 
                userData, 
                { headers: this.getHeader() }
            );
            
            console.log("Update response:", response);
            
            return {
                status: 200,
                data: response.data,
                message: "Profile updated successfully"
            };
        } catch (error) {
            console.error("Error updating user profile:", error);
            
            // Log detailed error information
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error status:", error.response.status);
            }
            
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to update profile"
            };
        }
    }
}