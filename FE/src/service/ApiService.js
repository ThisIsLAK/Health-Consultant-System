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
        // if (response && response.data) {
        //     return {
        //         status: 200,
        //         data: response.data,
        //     };
        // } else {
        //     return {
        //         status: 400,
        //         message: "Invalid response",
        //     };
        // }

        return response.data;
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
                message: error.message || "Login failed",
            };
        }
    }


    static async getLoggedInUserInfo() {
        const response = await axios.get(`${this.BASE_URL}/user/my-info`, {
            headers: this.getHeader()
        });
        return response.data;
    }

}