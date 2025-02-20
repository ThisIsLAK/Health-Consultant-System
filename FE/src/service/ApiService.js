import axios from "axios";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";

    // static getHeader() {
    //     const token = localStorage.getItem("token");
    //     return {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json"
    //     };
    // }
    static getHeader() {
        const token = localStorage.getItem("token");
        console.log("Header Token:", token); // Kiểm tra xem token có đúng không
    
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }
    

    /**AUTh && USERS API */
    static async registerUser(registration) {
        try {
            const response = await axios.post(`${this.BASE_URL}/identity/users`, registration);
            if (response && response.data) {
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
                message: error.response?.data.message || error.message || "Unable to register user",
            };
        }
    }

    static async loginUser(loginDetails) {
        try {
            const response = await axios.post(`${this.BASE_URL}/identity/auth/token`, loginDetails);
            if (response && response.data) {
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
                message: error.response?.data.message || error.message || "Login failed",
            };
        }
    }

    static async getLoggedInUserInfo() {
        try {
            const headers = this.getHeader();
            console.log("Request Headers:", headers);

            const response = await axios.get(`${this.BASE_URL}/identity/users/myInfo`, {
                headers: headers
            });

            console.log("User Info Response:", response); // Debug API response

            if (response && response.data) {
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
            console.error("Error fetching user info:", error.response);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || "Unable to fetch user info",
            };
        }
    }


}