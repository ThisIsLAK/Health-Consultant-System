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
            return {
                status: response.status,
                data: response.data,
                message: "Registration successful"
            };
        } catch (error) {
            console.error("Registration error:", error);
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || "Registration failed"
            };
        }
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
                `${this.BASE_URL}/identity/users/updateuser/${userData.id}`,
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

        switch (role) {
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
            const response = await axios.get(`${this.BASE_URL}/identity/admin/getAllActiveUser`, {
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
            // Using the finduserbyemail endpoint
            const response = await axios.get(
                `${this.BASE_URL}/identity/admin/finduserbyemail/${encodeURIComponent(email)}`,
                { headers: this.getHeader() }
            );

            console.log("Fetched user details:", response.data);

            // Handle response format with code, message, result structure
            if (response.data && typeof response.data === 'object') {
                if (response.data.code === 1000 && response.data.result !== undefined) {
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

    /**
     * Create a new blog post
     * @param {Object} blogData - The blog data containing title, content, etc.
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async createBlog(blogData) {
        try {
            if (!blogData.title || !blogData.description || !blogData.blogCode) {
                throw new Error("Blog title, description, and code are required");
            }

            console.log("Creating new blog with data:", blogData);

            const response = await axios.post(
                `${this.BASE_URL}/identity/admin/createblog`,
                blogData,
                { headers: this.getHeader() }
            );

            console.log("Create blog response:", response.data);

            return {
                status: 200,
                data: response.data,
                message: "Blog created successfully"
            };
        } catch (error) {
            console.error("Error creating blog:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to create blog"
            };
        }
    }

    /**
     * Get all blogs
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async getAllBlogs() {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/identity/admin/getallactiveblogs`,
                { headers: this.getHeader() }
            );

            console.log("Fetched blogs:", response.data);

            return {
                status: 200,
                data: response.data,
                message: "Blogs fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching blogs:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch blogs"
            };
        }
    }

    /**
     * Update a blog post
     * @param {string} blogCode - The blog code to update
     * @param {Object} blogData - The updated blog data
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async updateBlog(blogCode, blogData) {
        try {
            if (!blogCode) {
                throw new Error("Blog code is required for update");
            }

            console.log("Updating blog with code:", blogCode);
            console.log("Update data:", blogData);

            const response = await axios.put(
                `${this.BASE_URL}/identity/admin/updateblogbycode/${blogCode}`,
                blogData,
                { headers: this.getHeader() }
            );

            console.log("Update blog response:", response.data);

            if (response.data) {
                return {
                    status: 200,
                    data: response.data,
                    message: "Blog updated successfully"
                };
            } else {
                return {
                    status: 400,
                    message: "Invalid response format"
                };
            }
        } catch (error) {
            console.error("Error updating blog:", error);

            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to update blog"
            };
        }
    }

    /**
     * Get blog by code
     * @param {string} blogCode - The blog code to fetch
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async getBlogByCode(blogCode) {
        try {
            console.log("Requesting blog with code:", blogCode);  // Debug log
            const response = await axios.get(
                `${this.BASE_URL}/identity/admin/getblogbycode/${blogCode}`,
                { headers: this.getHeader() }
            );

            console.log("Raw blog response:", response);  // Debug log
            console.log("Fetched blog data:", response.data);

            if (response.data) {
                return {
                    status: 200,
                    data: response.data,
                    message: "Blog fetched successfully"
                };
            } else {
                throw new Error("No blog data received");
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch blog"
            };
        }
    }

    /**
     * Delete a blog
     * @param {string} blogCode - The blog code to delete
     * @returns {Promise<Object>} Response object with status and message
     */
    static async deleteBlog(blogCode) {
        try {
            if (!blogCode) {
                throw new Error("Blog code is required");
            }

            console.log("Deleting blog with code:", blogCode);

            const response = await axios.delete(
                `${this.BASE_URL}/identity/admin/deleteblogbycode/${blogCode}`,
                { headers: this.getHeader() }
            );

            return {
                status: 200,
                message: "Blog deleted successfully"
            };
        } catch (error) {
            console.error("Error deleting blog:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to delete blog"
            };
        }
    }

    /**
     * Create a new survey with questions and answer options
     * @param {Object} surveyData - The survey data containing title, description, questions, and answer options
     * @param {string} surveyData.title - The title of the survey
     * @param {string} surveyData.description - The description of the survey
     * @param {Array} surveyData.questions - Array of questions with questionText and answerOptions
     * @param {string} surveyData.questions[].questionText - The text of the question
     * @param {Array} surveyData.questions[].answerOptions - Array of answer options
     * @param {string} surveyData.questions[].answerOptions[].optionText - The text of the answer option
     * @param {number} surveyData.questions[].answerOptions[].score - The score for the answer option
     * @returns {Promise<Object>} Response object with status, data, and message
     */
    static async createSurvey(surveyData) {
        try {
            if (!surveyData.title || !surveyData.description || !surveyData.questions) {
                throw new Error("Survey title, description, and questions are required");
            }

            // Validate questions and answer options
            surveyData.questions.forEach((question, index) => {
                if (!question.questionText || !question.answerOptions) {
                    throw new Error(`Question at index ${index} must have questionText and answerOptions`);
                }
                question.answerOptions.forEach((option, optIndex) => {
                    if (!option.optionText || option.score === undefined) {
                        throw new Error(`Answer option at index ${optIndex} in question ${index} must have optionText and score`);
                    }
                });
            });

            console.log("Creating new survey with data:", surveyData);

            const response = await axios.post(
                `${this.BASE_URL}/identity/admin/createsurvey`,
                surveyData,
                { headers: this.getHeader() }
            );

            console.log("Create survey response:", response.data);

            return {
                status: 200,
                data: response.data,
                message: "Survey created successfully"
            };
        } catch (error) {
            console.error("Error creating survey:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to create survey"
            };
        }
    }

    /**
     * Get all surveys
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async getAllSurveys() {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/identity/admin/allsurveys`,
                { headers: this.getHeader() }
            );

            console.log("Fetched surveys:", response.data);

            if (response.data) {
                return {
                    status: 200,
                    data: response.data,
                    message: "Surveys fetched successfully"
                };
            } else {
                return {
                    status: 400,
                    message: "Invalid response format"
                };
            }
        } catch (error) {
            console.error("Error fetching surveys:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch surveys"
            };
        }
    }

    /**
 * Get a survey by surveyId
 * @param {string} surveyId - The ID of the survey to fetch
 * @returns {Promise<Object>} Response object with status and data/message
 */
    static async getSurveyById(surveyId) {
        try {
            if (!surveyId) {
                throw new Error("Survey ID is required");
            }

            console.log("Fetching survey with surveyId:", surveyId);

            const response = await axios.get(
                `${this.BASE_URL}/identity/admin/findsurveybyid/${surveyId}`,
                { headers: this.getHeader() }
            );

            console.log("Fetched survey details:", response.data);

            // Check if response follows the {code, message, result} format
            if (response.data && response.data.result !== undefined) {
                return {
                    status: 200,
                    data: response.data.result,
                    message: "Survey fetched successfully"
                };
            } else {
                return {
                    status: 200,
                    data: response.data,
                    message: "Survey fetched successfully"
                };
            }
        } catch (error) {
            console.error("Error fetching survey:", error);
            console.log(surveyId);


            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch survey"
            };
        }
    }

    /**
 * Update an existing survey by surveyId
 * @param {string} surveyId - The ID of the survey to update
 * @param {Object} surveyData - The updated survey data containing title, description, questions, and surveyCode
 * @param {string} surveyData.surveyCode - The survey code
 * @param {string} surveyData.title - The title of the survey
 * @param {string} surveyData.description - The description of the survey
 * @param {Array} surveyData.questions - Array of questions with questionId, questionText and answerOptions
 * @param {string} surveyData.questions[].questionId - The ID of the question (optional for existing questions)
 * @param {string} surveyData.questions[].questionText - The text of the question
 * @param {Array} surveyData.questions[].answerOptions - Array of answer options
 * @param {string} surveyData.questions[].answerOptions[].optionId - The ID of the answer option (optional for existing options)
 * @param {string} surveyData.questions[].answerOptions[].optionText - The text of the answer option
 * @param {number} surveyData.questions[].answerOptions[].score - The score for the answer option
 * @returns {Promise<Object>} Response object with status, data, and message
 */
    static async updateSurvey(surveyId, surveyData) {
        try {
            // Validate required fields
            if (!surveyId) {
                throw new Error("Survey ID is required for update");
            }
            if (!surveyData.title || !surveyData.description || !surveyData.questions || !surveyData.surveyCode) {
                throw new Error("Survey title, description, questions, and surveyCode are required");
            }

            // Validate questions and answer options, including IDs
            surveyData.questions.forEach((question, index) => {
                if (!question.questionText || !question.answerOptions) {
                    throw new Error(`Question at index ${index} must have questionText and answerOptions`);
                }
                question.answerOptions.forEach((option, optIndex) => {
                    if (!option.optionText || option.score === undefined) {
                        throw new Error(`Answer option at index ${optIndex} in question ${index} must have optionText and score`);
                    }
                });
            });

            console.log("Updating survey with surveyId:", surveyId);
            console.log("Update data:", surveyData);

            // Send PUT request to update the survey
            const response = await axios.put(
                `${this.BASE_URL}/identity/admin/updatesurvey/${surveyId}`,
                surveyData,
                { headers: this.getHeader() }
            );

            console.log("Update survey response:", response.data);

            // Check if response follows the {code, message, result} format
            if (response.data && response.data.result !== undefined) {
                return {
                    status: 200,
                    data: response.data.result,
                    message: "Survey updated successfully"
                };
            } else {
                return {
                    status: 200,
                    data: response.data,
                    message: "Survey updated successfully"
                };
            }
        } catch (error) {
            console.error("Error updating survey:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to update survey"
            };
        }
    }

    /**
 * Delete a survey by surveyId
 * @param {string} surveyId - The ID of the survey to delete
 * @returns {Promise<Object>} Response object with status and message
 */
    static async deleteSurveyBySurveyId(surveyId) {
        try {
            if (!surveyId) {
                throw new Error("Survey ID is required for deletion");
            }

            console.log("Deleting survey with surveyId:", surveyId);

            const response = await axios.delete(
                `${this.BASE_URL}/identity/admin/deletesurveybysurveyid/${surveyId}`, // Adjust endpoint if different
                { headers: this.getHeader() }
            );

            console.log("Delete survey response:", response.data);

            // Check if response has code property for API response format
            if (response.data && response.data.code !== undefined) {
                if (response.data.code === 1000) {
                    return {
                        status: 200,
                        message: response.data.message || "Survey deleted successfully"
                    };
                } else {
                    return {
                        status: 400,
                        message: response.data.message || "Failed to delete survey"
                    };
                }
            } else {
                return {
                    status: 200,
                    message: "Survey deleted successfully"
                };
            }
        } catch (error) {
            console.error("Error deleting survey:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to delete survey"
            };
        }
    }

    /* User Services */
    /**
     * Get all blogs for users
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async getAllBlogsForUsers() {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/identity/users/getallactiveblogs`,
                { headers: this.getHeader() }
            );

            console.log("Fetched blogs for users:", response.data);

            return {
                status: 200,
                data: response.data,
                message: "Blogs for users fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching blogs for users:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch blogs for users"
            };
        }
    }

    /**
     * Get a blog by blogCode for users
     * @param {string} blogCode - The unique code of the blog
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async getBlogByBlogCode(blogCode) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/identity/users/getblogbycode/${blogCode}`,
                { headers: this.getHeader() }
            );

            console.log("Fetched blog:", response.data);

            return {
                status: 200,
                data: response.data,
                message: "Blog fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching blog:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch blog"
            };
        }
    }

    /**
     * Get all surveys for users
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async getAllSurveysForUsers() {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/identity/users/getallactivesurveys`,
                { headers: this.getHeader() }
            );

            console.log("Fetched surveys for users:", response.data);

            return {
                status: 200,
                data: response.data,
                message: "Surveys for users fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching surveys for users:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch surveys for users"
            };
        }
    }

    /**
     * Get a survey for users to take survey
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async getSurveyByIdForUser(surveyId) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/identity/users/takesurvey/${surveyId}`,
                { headers: this.getHeader() }
            );

            console.log("Fetched survey:", response.data);

            return {
                status: 200,
                data: response.data,
                message: "Survey fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching survey:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch survey"
            };
        }
    }

    /**
     * Submit user's answer for a survey question
     * @param {Object} answerData - Object containing answerId, questionId, optionId, userId
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async submitUserAnswer(answerData) {
        try {
            console.log("Submitting answers:", answerData);
            console.log("Headers:", this.getHeader());

            const response = await axios.post(
                `${this.BASE_URL}/identity/users/submit-answers`,
                answerData, // Gửi trực tiếp mảng answerData
                { headers: this.getHeader() }
            );

            console.log("Submitted user answer:", response.data.result);

            return {
                status: 200,
                data: response.data,
                message: "User answer submitted successfully"
            };
        } catch (error) {
            console.error("Error submitting user answer:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to submit user answer"
            };
        }
    }

    /**
     * Get survey's score
     * @param {string} surveyId - ID của survey
     * @param {string} userId - ID của người dùng
     * @returns {Promise<Object>} Response object với status và dữ liệu kết quả
     */
    static async getSurveyResult(surveyId, userId) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/identity/users/survey-result`,
                {
                    params: { surveyId, userId },
                    headers: this.getHeader()
                }
            );

            console.log("Survey result response:", response.data);

            return {
                status: 200,
                data: response.data,
                message: "Survey result fetched successfully"
            };
        } catch (error) {
            console.error("Error fetching survey result:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to fetch survey result"
            };
        }
    }

    /**
     * Creates a new user by admin
     * @param {Object} userData - The user data containing email, password, name, role, etc.
     * @returns {Promise<Object>} Response object with status and data/message
     */
    static async createUserByAdmin(userData) {
        try {
            // Validate required fields
            if (!userData.email || !userData.password || !userData.name) {
                throw new Error("Required fields are missing");
            }

            console.log("Creating user with data:", userData);

            const response = await axios.post(
                `${this.BASE_URL}/identity/admin/createUserByAdmin`,
                userData,
                { headers: this.getHeader() }
            );

            console.log("Create user response:", response.data);

            // Handle different response formats
            if (response.data) {
                // If response has code property
                if (response.data.code !== undefined) {
                    if (response.data.code === 1000) {
                        return {
                            status: 200,
                            data: response.data.result || response.data,
                            message: response.data.message || "User created successfully"
                        };
                    } else {
                        return {
                            status: 400,
                            message: response.data.message || "Failed to create user"
                        };
                    }
                } else {
                    // Simple response format
                    return {
                        status: 200,
                        data: response.data,
                        message: "User created successfully"
                    };
                }
            } else {
                return {
                    status: 400,
                    message: "Invalid response format"
                };
            }
        } catch (error) {
            console.error("Error creating user:", error);

            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to create user"
            };
        }
    }

    /**
     * Delete a user by ID
     * @param {string} userId - The ID of the user to delete
     * @returns {Promise<Object>} Response object with status and message
     */
    static async deleteUserById(userId) {
        try {
            if (!userId) {
                throw new Error("User ID is required for deletion");
            }

            console.log("Deleting user with ID:", userId);

            const response = await axios.delete(
                `${this.BASE_URL}/identity/admin/deleteuserbyid/${userId}`,
                { headers: this.getHeader() }
            );

            console.log("Delete user response:", response.data);

            // Check if response has code property for API response format
            if (response.data && response.data.code !== undefined) {
                if (response.data.code === 1000) {
                    return {
                        status: 200,
                        message: response.data.message || "User deleted successfully"
                    };
                } else {
                    return {
                        status: 400,
                        message: response.data.message || "Failed to delete user"
                    };
                }
            } else {
                return {
                    status: 200,
                    message: "User deleted successfully"
                };
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || error.message || "Failed to delete user"
            };
        }
    }
}