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
            const response = await axios.post(`${this.BASE_URL}/identity/users/login`, loginDetails);
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

    // static async getLoggedInUserInfo() {
    //     try {
    //         const response = await axios.get(`${this.BASE_URL}/user/my-info`, {
    //             headers: this.getHeader()
    //         });
    //         return response.data;
    //     } catch (error) {
    //         return {
    //             status: 400,
    //             message: error.response?.data.message || error.message || "Unable to fetch user info",
    //         };
    //     }
    // }
}