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

    // Make sure the roleId mapping is correct
    static async loginUser(loginDetails) {
        try {
            console.log("Sending login request with:", loginDetails);
            const response = await axios.post(`${this.BASE_URL}/identity/auth/token`, loginDetails);
            
            console.log("Raw login response:", response);
            
            if (response && response.data) {
                return {
                    status: 200,
                    data: response.data
                };
            } else {
                return {
                    status: 400,
                    message: "Invalid response format"
                };
            }
        } catch (error) {
            console.error("Login request failed:", error);
            
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Login failed"
            };
        }
    }

    static async getLoggedInUserInfo() {
        try {
            console.log("Fetching user info with token:", localStorage.getItem("token"));
            console.log("Headers:", this.getHeader());
            
            const response = await axios.get(`${this.BASE_URL}/identity/users/myInfo`, {
                headers: this.getHeader()
            });
            
            console.log("Raw user info response:", response);
            
            if (response.data) {
                console.log("User info data:", response.data);
                return {
                    status: 200,
                    data: response.data
                };
            } else {
                return {
                    status: 204,
                    message: "No content returned for user info"
                };
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            
            if (error.response) {
                console.error("Error status:", error.response.status);
                console.error("Error data:", error.response.data);
            }
            
            return {
                status: error.response?.status || 400,
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

    // Helper method to get user role
    static getUserRole() {
        return localStorage.getItem("userRole");
    }

    // Helper method to check if user is authenticated
    static isAuthenticated() {
        return !!localStorage.getItem("token");
    }
    
    // Helper method to check if user is admin
    static isAdmin() {
        const role = this.getUserRole();
        console.log("Checking if admin. Current role:", role);
        return role === 'ADMIN';
    }
    
    static isPsychologist() {
        return this.getUserRole() === 'PSYCHOLOGIST';
    }
    
    static isManager() {
        return this.getUserRole() === 'MANAGER';
    }
    
    static isStudent() {
        const role = this.getUserRole();
        // Both students and parents use the USER interface
        return role === 'USER';
    }

    static isParent() {
        // If you need to distinguish parents in the future
        const role = this.getUserRole();
        const originalRole = localStorage.getItem("originalRole");
        return originalRole === 'PARENT';
    }

    // Helper method to logout user
    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
    }

    // Debug function to check role and redirection path
    static checkRoleAndRedirectPath() {
        const role = this.getUserRole();
        let redirectPath = '/';
        
        switch(role) {
            case 'ADMIN':
                redirectPath = '/adminuserlist';
                break;
            case 'PSYCHOLOGIST':
                redirectPath = '/psyapplist';
                break;
            case 'MANAGER':
                redirectPath = '/managerdashboard';
                break;
            default:
                redirectPath = '/';
        }
        
        console.log({
            storedToken: localStorage.getItem('token') ? "Token exists" : "No token",
            storedRole: role,
            redirectPath: redirectPath
        });
        
        return {
            role: role,
            redirectPath: redirectPath
        };
    }

    /**
     * Admin API Methods
     */
    static async getAllUsers() {
        try {
            const response = await axios.get(`${this.BASE_URL}/identity/admin/getAllUser`, {
                headers: this.getHeader()
            });
            
            console.log("Fetched users:", response.data);
            
            // Check if response follows the {code, message, result} format
            if (response.data && response.data.result !== undefined) {
                return {
                    status: 200,
                    data: response.data.result
                };
            } else {
                return {
                    status: 200,
                    data: response.data
                };
            }
        } catch (error) {
            console.error("Error fetching all users:", error);
            
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch users"
            };
        }
    }
    
    /**
     * Get a user by ID
     */
    static async getUserById(userId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/identity/admin/getUser/${userId}`, {
                headers: this.getHeader()
            });
            
            console.log("Fetched user details:", response.data);
            
            // Check if response follows the {code, message, result} format
            if (response.data && response.data.result !== undefined) {
                return {
                    status: 200,
                    data: response.data.result
                };
            } else {
                return {
                    status: 200,
                    data: response.data
                };
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch user details"
            };
        }
    }
    
    /**
     * Update a user by ID
     */
    static async updateUserById(userId, userData) {
        try {
            // Using email instead of userId for the endpoint
            const userEmail = userData.email;
            
            if (!userEmail) {
                throw new Error("User email is required for update");
            }
            
            console.log("Updating user with email:", userEmail);
            console.log("Update data:", userData);
            
            const response = await axios.put(`${this.BASE_URL}/identity/admin/updateUser/${userEmail}`, userData, {
                headers: this.getHeader()
            });
            
            console.log("Update user response:", response.data);
            
            // Check if response follows the {code, message, result} format
            if (response.data && response.data.result !== undefined) {
                return {
                    status: 200,
                    data: response.data.result,
                    message: "User updated successfully"
                };
            } else {
                return {
                    status: 200,
                    data: response.data,
                    message: "User updated successfully"
                };
            }
        } catch (error) {
            console.error("Error updating user:", error);
            
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to update user"
            };
        }
    }
    
    /**
     * Get a user by email
     */
    static async getUserByEmail(email) {
        try {
            // Updated endpoint format - directly using the email without 'getUser/'
            const response = await axios.get(`${this.BASE_URL}/identity/admin/${encodeURIComponent(email)}`, {
                headers: this.getHeader()
            });
            
            console.log("Fetched user details:", response.data);
            
            // Handle response format with code, message, result structure
            if (response.data && typeof response.data === 'object') {
                if (response.data.code !== undefined && response.data.result !== undefined) {
                    return {
                        status: 200,
                        data: response.data // Return whole response to process result at component level
                    };
                } else {
                    return {
                        status: 200,
                        data: response.data
                    };
                }
            } else {
                return {
                    status: 400,
                    message: "Invalid response format"
                };
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch user details"
            };
        }
    }
    
    /**
     * Update a user by email
     */
    static async updateUserByEmail(email, userData) {
        try {
            if (!email) {
                throw new Error("User email is required for update");
            }
            
            console.log("Updating user with email:", email);
            console.log("Update data:", userData);
            
            // Ensure we're sending the correct active status
            const dataToSend = {
                ...userData,
                active: userData.active === true // ensure it's a boolean
            };
            
            const response = await axios.put(
                `${this.BASE_URL}/identity/admin/updateUser/${encodeURIComponent(email)}`, 
                dataToSend, 
                { headers: this.getHeader() }
            );
            
            console.log("Update user response:", response.data);
            
            // Handle response format with code, message, result structure
            if (response.data && typeof response.data === 'object') {
                if (response.data.code !== undefined) {
                    if (response.data.code === 0) {
                        return {
                            status: 200,
                            data: response.data.result || response.data,
                            message: "User updated successfully"
                        };
                    } else {
                        return {
                            status: 400,
                            message: response.data.message || "Failed to update user"
                        };
                    }
                } else {
                    return {
                        status: 200,
                        data: response.data,
                        message: "User updated successfully"
                    };
                }
            } else {
                return {
                    status: 400,
                    message: "Invalid response format"
                };
            }
        } catch (error) {
            console.error("Error updating user:", error);
            
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to update user"
            };
        }
    }
}