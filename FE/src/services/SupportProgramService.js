import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const API_URL = `${BASE_URL}/identity/admin`;

// Helper function to get the authentication token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('Auth Token:', token ? `${token.substring(0, 15)}...` : 'No token found');
  return token;
};

// Configure axios with authentication headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  console.log('Request headers:', headers);
  return { headers };
};

class SupportProgramService {
  // Create a new support program
  async createSupportProgram(programData) {
    try {
      const CREATE_SP_URL = `${API_URL}/createsupportprogram`;
      const response = await axios.post(CREATE_SP_URL, programData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error creating support program:', error);
      throw error;
    }
  }

  // Get all support programs
  async getAllSupportPrograms() {
    try {
      const GET_ALL = `${API_URL}/getallprograms`;
      console.log('Fetching all support programs from:', GET_ALL);
      const headers = getAuthHeaders();
      const response = await axios.get(GET_ALL, headers);
      console.log('Support programs response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching support programs:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      throw error;
    }
  }

  // Get a support program by code
  async getSupportProgramByCode(programCode) {
    try {
      const GET_BY_CODE = `${API_URL}/findprogrambycode`;
      const response = await axios.get(`${GET_BY_CODE}/${programCode}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching support program with code ${programCode}:`, error);
      throw error;
    }
  }

  // Update an existing support program
  async updateSupportProgram(programCode, programData) {
    try {
      const UPDATE_SP_URL = `${API_URL}/updateprogrambycode`;
      const response = await axios.put(`${UPDATE_SP_URL}/${programCode}`, programData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error updating support program with code ${programCode}:`, error);
      throw error;
    }
  }

  // Delete a support program
  async deleteSupportProgram(programCode) {
    try {
      const  DELETE_SP_URL = `${API_URL}/deleteprogrambycode`;
      const response = await axios.delete(`${DELETE_SP_URL}/${programCode}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error deleting support program with code ${programCode}:`, error);
      throw error;
    }
  }

  // Sign up for a support program
  async signupForProgram(signupData) {
    try {
      const response = await axios.post(`${API_URL}/signup`, signupData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error signing up for support program:', error);
      throw error;
    }
  }
}

export default new SupportProgramService();
