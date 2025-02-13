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
        console.log('Registration data:', registration);
        const response = await axios.post(`${this.BASE_URL}/identity/users`, registration)
        return response.data;
    }


    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/identity/users/login`, loginDetails)
        // return response.data;
        return {
            status: 200,
            data: response.data,
          };
    }

    static async getLoggedInUserInfo() {
        const response = await axios.get(`${this.BASE_URL}/user/my-info`, {
            headers: this.getHeader()
        });
        return response.data;
    }

}