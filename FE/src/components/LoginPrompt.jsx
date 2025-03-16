import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  AccountCircle, 
  ArrowForwardIos, 
  VerifiedUser,
  Security,
  AccessTime,
  Psychology,
  School,
  SupportAgent,
  MenuBook
} from '@mui/icons-material';

/**
 * A reusable component with friendly messaging for authentication
 * @param {Object} props Component props
 * @param {string} props.message Custom message to display (optional)
 * @param {string} props.title Custom title to display (optional)
 * @param {string} props.buttonText Custom button text (optional)
 * @param {function} props.onButtonClick Custom button click handler (optional)
 * @param {string} props.featureName Name of the feature (e.g., "surveys", "blogs")
 */
const LoginPrompt = ({ 
  message,
  title,
  buttonText = "Sign In",
  onButtonClick,
  featureName = "this feature"
}) => {
  const navigate = useNavigate();
  
  // Default friendly titles and messages if not provided
  const defaultTitle = `Ready to explore our ${featureName}?`;
  const defaultMessage = `Sign in to access our ${featureName} and get personalized recommendations based on your needs.`;
  
  // Use provided props or defaults
  const displayTitle = title || defaultTitle;
  const displayMessage = message || defaultMessage;
  
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate('/login');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      } 
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3, yoyo: Infinity, ease: "easeInOut" }
    },
    tap: { scale: 0.95 }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 3,
              background: 'linear-gradient(to right bottom, #ffffff, #f9f9ff)',
              mb: 4
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h3" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#4a6bff',
                      mb: 2 
                    }}
                  >
                    {displayTitle}
                  </Typography>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      mb: 3, 
                      color: '#555',
                      fontSize: '1.1rem',
                      lineHeight: 1.6
                    }}
                  >
                    {displayMessage}
                  </Typography>
                </motion.div>
                
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <motion.div 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      onClick={handleButtonClick}
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        backgroundColor: '#4a6bff',
                        '&:hover': {
                          backgroundColor: '#3950c4'
                        }
                      }}
                      endIcon={<ArrowForwardIos />}
                    >
                      {buttonText}
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="large"
                      onClick={() => navigate('/')}
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        borderColor: '#4a6bff',
                        color: '#4a6bff',
                        '&:hover': {
                          borderColor: '#3950c4',
                          backgroundColor: 'rgba(74, 107, 255, 0.05)'
                        }
                      }}
                    >
                      Explore More
                    </Button>
                  </motion.div>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                <motion.div
                  variants={iconVariants}
                >
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 180,
                      height: 180,
                      margin: '0 auto',
                      backgroundColor: 'rgba(74, 107, 255, 0.1)',
                      borderRadius: '50%',
                      p: 3
                    }}
                  >
                    <AccountCircle sx={{ fontSize: 140, color: '#4a6bff' }} />
                  </Box>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 2, 
                      color: '#666',
                      fontSize: '0.9rem' 
                    }}
                  >
                    It only takes a minute to sign in!
                  </Typography>
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Benefits Section */}
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              mb: 4, 
              fontWeight: 600,
              color: '#333'
            }}
          >
            Benefits of Creating an Account
          </Typography>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[
            { 
              icon: <VerifiedUser />, 
              title: "Personalized Experience", 
              description: "Get recommendations tailored to your specific needs and preferences." 
            },
            { 
              icon: <AccessTime />, 
              title: "Save Time", 
              description: "Quick access to your appointments, surveys, and preferred resources." 
            },
            { 
              icon: <Security />, 
              title: "Secure & Private", 
              description: "Your data is encrypted and protected with the highest security standards." 
            }
          ].map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        color: '#4a6bff'
                      }}
                    >
                      {benefit.icon}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          ml: 1.5,
                          fontWeight: 600
                        }}
                      >
                        {benefit.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <motion.div variants={itemVariants}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              mb: 5,
              bgcolor: '#f8f9fa' 
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: '#333'
              }}
            >
              Unlock All Features with Your Account
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List>
                  {[
                    { 
                      icon: <Psychology color="primary" />, 
                      text: "Schedule appointments with qualified psychologists"
                    },
                    { 
                      icon: <School color="primary" />, 
                      text: "Access educational resources tailored to your needs"
                    }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <ListItem>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  {[
                    { 
                      icon: <SupportAgent color="primary" />, 
                      text: "Join support programs with like-minded individuals"
                    },
                    { 
                      icon: <MenuBook color="primary" />, 
                      text: "Read expert articles and stay updated with our blog"
                    }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <ListItem>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Testimonials */}
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: '#333'
            }}
          >
            What Our Users Say
          </Typography>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[
            {
              name: "Sarah J.",
              role: "Student",
              testimonial: "Creating an account was the best decision I made. The personalized recommendations helped me find resources I didn't know I needed."
            },
            {
              name: "Michael T.",
              role: "Graduate Student",
              testimonial: "The booking system is so convenient. I can easily schedule sessions with psychologists that fit my busy schedule."
            },
            {
              name: "Emily R.",
              role: "Undergraduate",
              testimonial: "I love having all my surveys and appointments in one place. It makes managing my mental health journey so much easier."
            }
          ].map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    borderRadius: 2,
                    position: 'relative',
                    p: 2
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{
                        fontStyle: 'italic',
                        color: '#555',
                        mb: 3
                      }}
                    >
                      "{testimonial.testimonial}"
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountCircle sx={{ fontSize: 40, color: '#4a6bff', mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Final CTA */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              mb: 3,
              textAlign: 'center',
              backgroundImage: 'linear-gradient(135deg, #4a6bff 0%, #6a8fff 100%)',
              color: 'white'
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                mb: 2,
                fontWeight: 600
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}
            >
              Join our community today and take the first step towards a healthier, more balanced life. 
              Create an account to unlock all features and start your mental wellness journey.
            </Typography>
            <motion.div 
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="contained" 
                size="large"
                onClick={handleButtonClick}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  bgcolor: 'white',
                  color: '#4a6bff',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                {buttonText}
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default LoginPrompt;