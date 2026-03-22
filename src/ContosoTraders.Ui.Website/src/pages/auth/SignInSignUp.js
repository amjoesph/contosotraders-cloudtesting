import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Box, Card, CardContent, Tab, Tabs, TextField,
  Button, Typography, Divider, InputAdornment, IconButton, CircularProgress, Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { submitAction } from '../../actions/actions';
import './auth.scss';

// Dummy API — simulates network delay
const fakeSignIn = (email, password) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (password.length < 6) return reject(new Error('Invalid credentials'));
      resolve({ loggedIn: true, token: 'fake-token-' + Date.now(), userName: email, email });
    }, 1200)
  );

const fakeSignUp = (firstName, lastName, email, password) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (password.length < 6) return reject(new Error('Signup failed'));
      resolve({ loggedIn: true, token: 'fake-token-' + Date.now(), userName: email, email, firstName, lastName });
    }, 1200)
  );

const fakeFacebookLogin = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve({ loggedIn: true, token: 'fake-fb-token-' + Date.now(), userName: 'facebook.user@example.com', email: 'facebook.user@example.com' });
    }, 1000)
  );

// Sign In form
function SignInForm({ onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: yup.object({
      email: yup.string().email('Enter a valid email').required('Email is required'),
      password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const user = await fakeSignIn(values.email, values.password);
        onSuccess(user);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="auth-form">
      {error && <Alert severity="error" className="auth-alert">{error}</Alert>}
      <TextField
        fullWidth label="Email" name="email" type="email"
        value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        className="auth-field"
      />
      <TextField
        fullWidth label="Password" name="password"
        type={showPassword ? 'text' : 'password'}
        value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        className="auth-field"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit" fullWidth variant="contained" className="auth-btn-primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
      </Button>
    </form>
  );
}

// Sign Up form
function SignUpForm({ onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', email: '', password: '' },
    validationSchema: yup.object({
      firstName: yup.string().min(2, 'Too short').required('First name is required'),
      lastName: yup.string().min(2, 'Too short').required('Last name is required'),
      email: yup.string().email('Enter a valid email').required('Email is required'),
      password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const user = await fakeSignUp(values.firstName, values.lastName, values.email, values.password);
        onSuccess(user);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="auth-form">
      {error && <Alert severity="error" className="auth-alert">{error}</Alert>}
      <Box className="auth-name-row">
        <TextField
          label="First Name" name="firstName"
          value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
          className="auth-field"
        />
        <TextField
          label="Last Name" name="lastName"
          value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
          className="auth-field"
        />
      </Box>
      <TextField
        fullWidth label="Email" name="email" type="email"
        value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        className="auth-field"
      />
      <TextField
        fullWidth label="Password" name="password"
        type={showPassword ? 'text' : 'password'}
        value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        className="auth-field"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit" fullWidth variant="contained" className="auth-btn-primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
      </Button>
    </form>
  );
}

function SignInSignUp({ submitAction }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [fbLoading, setFbLoading] = useState(false);

  const handleSuccess = (user) => {
    localStorage.setItem('state', JSON.stringify(user));
    submitAction(user);
    navigate('/');
  };

  const handleFacebook = async () => {
    setFbLoading(true);
    try {
      const user = await fakeFacebookLogin();
      handleSuccess(user);
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <Box className="auth-page">
      <Card className="auth-card" elevation={3}>
        <CardContent className="auth-card-content">
          <Typography variant="h5" className="auth-title">
            Welcome to Contoso Traders
          </Typography>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered className="auth-tabs">
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          <Box className="auth-tab-content">
            {tab === 0 && <SignInForm onSuccess={handleSuccess} />}
            {tab === 1 && <SignUpForm onSuccess={handleSuccess} />}
          </Box>

          <Divider className="auth-divider">
            <Typography variant="caption" color="text.secondary">OR</Typography>
          </Divider>

          <Button
            fullWidth variant="contained" className="auth-btn-facebook"
            onClick={handleFacebook} disabled={fbLoading}
            startIcon={
              fbLoading ? null : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )
            }
          >
            {fbLoading ? <CircularProgress size={22} color="inherit" /> : 'Continue with Facebook'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

const mapDispatchToProps = (dispatch) => ({
  submitAction: (user) => dispatch(submitAction(user)),
});

export default connect(null, mapDispatchToProps)(SignInSignUp);
