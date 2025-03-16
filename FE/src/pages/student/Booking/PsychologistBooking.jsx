import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import LoginPrompt from '../../../components/LoginPrompt';

// MUI imports
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  Avatar, 
  Card, 
  CardContent, 
  CardActionArea, 
  IconButton,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CalendarToday, 
  Person, 
  CheckCircle, 
  Email,
  LockOutlined
} from '@mui/icons-material';

import './PsychologistBooking.css';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1]; // Get JWT payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
};

const PsychologistBooking = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [psychologists, setPsychologists] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Fetch psychologists from the API only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:8080/identity/users/allpsy', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("Psychologists data:", response.data);
        
        // Extract psychologists from response and filter out inactive ones
        const psychologistsData = response.data.result || [];
        const activePsychologists = psychologistsData.filter(psy => psy.active !== false);
        
        setPsychologists(activePsychologists);
        setFilteredPsychologists(activePsychologists);
      } catch (error) {
        console.error("Error fetching psychologists:", error);
        toast.error("Failed to load psychologists. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, [isAuthenticated]);

  // Filter psychologists based on search query
  useEffect(() => {
    if (!isAuthenticated) return;
    
    if (searchQuery.trim() === '') {
      setFilteredPsychologists(psychologists);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = psychologists.filter(
        psych => {
          const name = psych.name ? psych.name.toLowerCase() : '';
          const email = psych.email ? psych.email.toLowerCase() : '';
          return name.includes(query) || email.includes(query);
        }
      );
      setFilteredPsychologists(filtered);
    }
  }, [searchQuery, psychologists, isAuthenticated]);

  // Update the generateTimeSlots function to use the specific time slots you requested

// Replace the current generateTimeSlots function with this:
const generateTimeSlots = () => {
  // Define the specific time slots as requested
  return [
    {
      id: 0,
      time: "8h-10h",
      value: "8h-10h"
    },
    {
      id: 1,
      time: "10h-12h",
      value: "10h-12h"
    },
    {
      id: 2,
      time: "13h-15h", 
      value: "13h-15h"
    },
    {
      id: 3,
      time: "15h-17h",
      value: "15h-17h"
    }
  ];
};

  const timeSlots = generateTimeSlots();

  // Calendar helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ 
        day, 
        date,
        isToday: isToday(date),
        isPast: isPastDay(date)
      });
    }
    
    return days;
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Check if date is in the past
  const isPastDay = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Format month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Navigate to previous or next month
  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // Select a date on the calendar
  const handleDateSelect = (date) => {
    if (!date || isPastDay(date)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  // Create a unique key for bookings based on date and psychologist
  const getBookingKey = (date, psychologistId) => {
    if (!date) return null;
    return `${date.toISOString().split('T')[0]}-${psychologistId}`;
  };

  // Check if a slot is booked
  const isSlotBooked = (date, psychologistId, slotId) => {
    const key = getBookingKey(date, psychologistId);
    return key && bookings[key] && bookings[key][slotId];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      console.log("Decoded token:", decoded);
      console.log("User ID (from issuer):", decoded.iss);
      
      // Store the userId in localStorage for easy access
      if (decoded.iss) {
        localStorage.setItem('userId', decoded.iss);
      }
    } else {
      console.error("No token found in localStorage");
    }
  }, []);

  // Book the selected appointment with exact field names matching the API
  const bookAppointment = async () => {
    if (!selectedDate || !selectedPsychologist || selectedSlot === null) {
      toast.error("Please select date, psychologist, and time slot");
      return;
    }
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("You need to be logged in to book an appointment");
        return;
      }
      
      // Extract userId from token instead of using localStorage directly
      const decoded = parseJwt(token);
      const userId = decoded?.iss;
      
      if (!userId) {
        toast.error("Could not determine user identity. Please log in again.");
        return;
      }
      
      console.log("Using userId:", userId);
      
      // Format the date for the API
      const appointmentDate = new Date(selectedDate);
      const formattedDate = appointmentDate.toISOString();
      
      // Create payload EXACTLY matching the API requirements
      const appointmentData = {
        userId: userId,
        psychologistId: selectedPsychologist.id,
        appointmentDate: formattedDate,
        timeSlot: timeSlots[selectedSlot].value
      };
      
      console.log("Sending booking data:", appointmentData);
      
      // Make API request
      const response = await axios.post(
        'http://localhost:8080/identity/users/bookappointment',
        appointmentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Booking response:", response.data);
      
      // Check if booking was successful
      if (response.data && (response.data.code === 1000)) {
        // Update local state to reflect booking
        const bookingKey = getBookingKey(selectedDate, selectedPsychologist.id);
        const newBookings = { ...bookings };
        if (!newBookings[bookingKey]) {
          newBookings[bookingKey] = {};
        }
        newBookings[bookingKey][selectedSlot] = "Booked";
        setBookings(newBookings);
        
        // Show success message
        toast.success("Appointment booked successfully!");
        setShowConfirmation(true);
        
        // Hide confirmation after delay
        setTimeout(() => {
          setShowConfirmation(false);
          navigate('/appointments'); // Navigate to appointments list
        }, 3000);
      } else {
        toast.error(response.data?.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // If not authenticated, render the login prompt
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <LoginPrompt 
          featureName="psychologist appointments"
          title="Ready to speak with a mental health professional?"
          message="Sign in to book appointments with our qualified psychologists. Get the support you need on your schedule."
          buttonText="Sign In to Book" 
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
            Book an Appointment
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Schedule a session with one of our professional psychologists
          </Typography>
        </Box>
        
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Grid container spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
            {/* Calendar Section */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  bgcolor: '#f9f9f9', 
                  borderRadius: 2,
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <IconButton onClick={() => changeMonth(-1)}>
                    <ChevronLeft />
                  </IconButton>
                  <Typography variant="h6">{formatMonthYear(currentDate)}</Typography>
                  <IconButton onClick={() => changeMonth(1)}>
                    <ChevronRight />
                  </IconButton>
                </Box>
                
                <Grid container spacing={1}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Grid item xs={1.7} key={day}>
                      <Typography 
                        align="center" 
                        sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#555', mb: 1 }}
                      >
                        {day}
                      </Typography>
                    </Grid>
                  ))}
                  
                  {generateCalendarDays().map((item, index) => (
                    <Grid item xs={1.7} key={index}>
                      <Box
                        onClick={() => handleDateSelect(item.date)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 40,
                          width: '100%',
                          borderRadius: '50%',
                          cursor: item.day && !item.isPast ? 'pointer' : 'default',
                          bgcolor: !item.day ? 'transparent' : 
                                  item.isPast ? 'transparent' : 
                                  item.isToday ? '#e3f2fd' : 
                                  selectedDate && item.date?.getTime() === selectedDate?.getTime() ? '#3498db' : 'transparent',
                          color: !item.day ? 'transparent' : 
                                 item.isPast ? '#ccc' : 
                                 item.isToday ? '#1976d2' : 
                                 selectedDate && item.date?.getTime() === selectedDate?.getTime() ? 'white' : 'inherit',
                          '&:hover': {
                            bgcolor: !item.day || item.isPast ? undefined : selectedDate && item.date?.getTime() === selectedDate?.getTime() ? '#3498db' : '#edf5ff'
                          },
                          visibility: !item.day ? 'hidden' : 'visible'
                        }}
                      >
                        {item.day}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                {selectedDate && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1, color: '#1976d2' }}>
                    <Typography variant="body2">
                      <CalendarToday fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Selected date: {formatDate(selectedDate)}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            {/* Psychologist Selection */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  bgcolor: '#f9f9f9', 
                  borderRadius: 2,
                  height: '100%'
                }}
              >
                <Typography variant="h5" sx={{ mb: 3 }}>Select a Psychologist</Typography>
                
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Search color="action" sx={{ ml: 1, mr: 1 }} />
                    }}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={40} />
                    </Box>
                  ) : filteredPsychologists.length > 0 ? (
                    filteredPsychologists.map(psychologist => (
                      <Card 
                        key={psychologist.id} 
                        variant="outlined"
                        sx={{ 
                          mb: 2, 
                          borderColor: selectedPsychologist?.id === psychologist.id ? '#3498db' : '#eee',
                          bgcolor: selectedPsychologist?.id === psychologist.id ? '#e3f2fd' : 'white',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <CardActionArea onClick={() => setSelectedPsychologist(psychologist)}>
                          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: '#3498db', 
                                color: 'white',
                                width: 50, 
                                height: 50,
                                mr: 2
                              }}
                            >
                              <Person fontSize="large" />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {psychologist.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Email fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                                {psychologist.email}
                              </Typography>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, color: '#777' }}>
                      <Typography>No psychologists found</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
            
            {/* Time Slots & Booking */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  bgcolor: '#f9f9f9', 
                  borderRadius: 2,
                  height: '100%'
                }}
              >
                <Typography variant="h5" sx={{ mb: 3 }}>Complete Your Booking</Typography>
                
                {selectedDate && selectedPsychologist ? (
                  <>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Psychologist:</strong> {selectedPsychologist.name}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Date:</strong> {formatDate(selectedDate)}
                      </Typography>
                    </Paper>
                    
                    <Typography variant="h6" sx={{ mb: 2 }}>Select a Time Slot</Typography>
                    <Grid container spacing={1} sx={{ mb: 3 }}>
                      {timeSlots.map(slot => (
                        <Grid item xs={6} key={slot.id}>
                          <Button
                            fullWidth
                            variant={selectedSlot === slot.id ? "contained" : "outlined"}
                            onClick={() => setSelectedSlot(slot.id)}
                            disabled={isSlotBooked(selectedDate, selectedPsychologist.id, slot.id)}
                            sx={{
                              p: 1.5,
                              textTransform: 'none',
                              bgcolor: isSlotBooked(selectedDate, selectedPsychologist.id, slot.id) ? '#f3f3f3' : 
                                      selectedSlot === slot.id ? '#3498db' : 'white',
                              color: isSlotBooked(selectedDate, selectedPsychologist.id, slot.id) ? '#aaa' : 
                                     selectedSlot === slot.id ? 'white' : 'inherit',
                              borderColor: isSlotBooked(selectedDate, selectedPsychologist.id, slot.id) ? '#ddd' : 
                                          selectedSlot === slot.id ? '#3498db' : '#ddd',
                              '&:hover': {
                                borderColor: isSlotBooked(selectedDate, selectedPsychologist.id, slot.id) ? '#ddd' : '#3498db',
                                bgcolor: isSlotBooked(selectedDate, selectedPsychologist.id, slot.id) ? '#f3f3f3' : 
                                        selectedSlot === slot.id ? '#3498db' : 'white'
                              }
                            }}
                          >
                            {slot.time}
                            {isSlotBooked(selectedDate, selectedPsychologist.id, slot.id) && (
                              <Typography variant="caption" display="block" sx={{ color: '#999', mt: 0.5 }}>
                                Booked
                              </Typography>
                            )}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                    
                    {selectedSlot !== null && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>Complete Booking</Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            mb: 3, 
                            bgcolor: '#f0f8ff',
                            borderRadius: 2
                          }}
                        >
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Summary:</strong> Appointment with {selectedPsychologist.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Date:</strong> {formatDate(selectedDate)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Time:</strong> {timeSlots[selectedSlot].time}
                          </Typography>
                        </Paper>
                        
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={bookAppointment}
                          disabled={submitting}
                          sx={{
                            py: 1.5,
                            bgcolor: '#3498db',
                            '&:hover': {
                              bgcolor: '#2980b9'
                            }
                          }}
                        >
                          {submitting ? 'Booking...' : 'Confirm Appointment'}
                        </Button>
                        
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            mt: 2, 
                            display: 'block', 
                            textAlign: 'center', 
                            color: '#777' 
                          }}
                        >
                          By booking this appointment, you agree to our cancellation policy. You can cancel or reschedule up to 24 hours before your appointment.
                        </Typography>
                      </Box>
                    )}
                    
                    {showConfirmation && (
                      <Alert 
                        severity="success"
                        variant="filled"
                        icon={<CheckCircle />}
                        sx={{ 
                          mt: 2, 
                          p: 2, 
                          borderRadius: 2,
                          animation: 'fadeIn 0.5s'
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 1 }}>Appointment Booked!</Typography>
                        <Paper sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)', p: 2, borderRadius: 1, mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Psychologist:</strong> {selectedPsychologist.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Date:</strong> {formatDate(selectedDate)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Time:</strong> {timeSlots[selectedSlot].time}
                          </Typography>
                        </Paper>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          You will be redirected to your appointments page in a moment...
                        </Typography>
                      </Alert>
                    )}
                  </>
                ) : (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      py: 6,
                      textAlign: 'center',
                      color: '#777'
                    }}
                  >
                    <CalendarToday sx={{ fontSize: '3rem', color: '#bbb', mb: 2 }} />
                    <Typography>
                      {!selectedDate 
                        ? 'Please select a date from the calendar' 
                        : 'Please select a psychologist to continue'}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default PsychologistBooking;