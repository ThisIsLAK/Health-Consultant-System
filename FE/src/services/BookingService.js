import axios from 'axios';

// Use a fixed BASE_URL like in ApiService instead of process.env
const BASE_URL = "http://localhost:8080";

class BookingService {
  // Get headers with authentication token
  getHeader() {
    const token = localStorage.getItem("token");
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async bookAppointment(appointmentData) {
    try {
      const response = await axios.post(`${BASE_URL}/appointments`, appointmentData, {
        headers: this.getHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error booking appointment' };
    }
  }

  async cancelAppointment(appointmentId) {
    try {
      const response = await axios.delete(`${BASE_URL}/appointments/${appointmentId}`, {
        headers: this.getHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error canceling appointment' };
    }
  }

  async getUserAppointments(userId) {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/user/${userId}`, {
        headers: this.getHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching user appointments' };
    }
  }

  async getPsychologistAppointments(psychologistId) {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/psychologist/${psychologistId}`, {
        headers: this.getHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching psychologist appointments' };
    }
  }
}

export default new BookingService();
