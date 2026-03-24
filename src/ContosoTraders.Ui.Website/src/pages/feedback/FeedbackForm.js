import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  MenuItem, Select, FormControl, InputLabel, FormHelperText,
  Checkbox, FormControlLabel, CircularProgress, Alert
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './feedback.scss';

const SECTIONS = [
  'General Enquiry',
  'Technical Support',
  'Billing & Payments',
  'Returns & Refunds',
  'Product Feedback',
  'Other',
];

// Dummy API
const fakeSubmit = () =>
  new Promise((resolve) => setTimeout(resolve, 1500));

// Simple math captcha
function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const captcha = useMemo(() => generateCaptcha(), []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      section: '',
      comment: '',
      captchaAnswer: '',
      agree: false,
    },
    validationSchema: yup.object({
      name: yup.string().min(2, 'Too short').required('Name is required'),
      email: yup.string().email('Enter a valid email').required('Email is required'),
      section: yup.string().required('Please select a section'),
      comment: yup.string().min(10, 'Minimum 10 characters').required('Comment is required'),
      captchaAnswer: yup
        .number()
        .typeError('Enter a number')
        .required('Please answer the captcha')
        .test('captcha', 'Incorrect answer', (val) => val === captcha.answer),
      agree: yup.bool().oneOf([true], 'You must agree to continue'),
    }),
    onSubmit: async () => {
      setLoading(true);
      try {
        await fakeSubmit();
        setSubmitted(true);
      } finally {
        setLoading(false);
      }
    },
  });

  if (submitted) {
    return (
      <Box className="feedback-page">
        <Card className="feedback-card" elevation={3}>
          <CardContent className="feedback-success">
            <CheckCircleOutlineIcon className="feedback-success__icon" />
            <Typography variant="h5" className="feedback-success__title">
              Thank you for reaching out!
            </Typography>
            <Typography className="feedback-success__text">
              Your request has been submitted successfully. Our team will get back to you at <strong>{formik.values.email}</strong> within 1–2 business days.
            </Typography>
            <Button
              variant="outlined"
              className="feedback-success__btn"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="feedback-page">
      <Card className="feedback-card" elevation={3}>
        <CardContent className="feedback-card-content">
          <Typography variant="h5" className="feedback-title">
            Feedback &amp; Support
          </Typography>
          <Typography className="feedback-subtitle">
            Have a question or issue? Fill in the form below and we'll get back to you.
          </Typography>

          <form onSubmit={formik.handleSubmit} className="feedback-form">

            {/* Name & Email */}
            <Box className="feedback-row">
              <TextField
                label="Name" name="name" fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                className="feedback-field"
              />
              <TextField
                label="Email" name="email" type="email" fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                className="feedback-field"
              />
            </Box>

            {/* Section dropdown */}
            <FormControl
              fullWidth
              error={formik.touched.section && Boolean(formik.errors.section)}
              className="feedback-field"
            >
              <InputLabel>Section</InputLabel>
              <Select
                name="section"
                value={formik.values.section}
                label="Section"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {SECTIONS.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
              {formik.touched.section && formik.errors.section && (
                <FormHelperText>{formik.errors.section}</FormHelperText>
              )}
            </FormControl>

            {/* Comment */}
            <TextField
              label="Comment" name="comment" multiline rows={5} fullWidth
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.comment && Boolean(formik.errors.comment)}
              helperText={formik.touched.comment && formik.errors.comment}
              className="feedback-field"
            />

            {/* Captcha */}
            <Box className="feedback-captcha">
              <Box className="feedback-captcha__box">
                <Typography className="feedback-captcha__question">
                  {captcha.a} + {captcha.b} = ?
                </Typography>
              </Box>
              <TextField
                label="Your Answer" name="captchaAnswer"
                value={formik.values.captchaAnswer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.captchaAnswer && Boolean(formik.errors.captchaAnswer)}
                helperText={formik.touched.captchaAnswer && formik.errors.captchaAnswer}
                className="feedback-captcha__input"
                inputProps={{ maxLength: 3 }}
              />
            </Box>

            {/* Agree checkbox */}
            <Box className="feedback-agree">
              <FormControlLabel
                control={
                  <Checkbox
                    name="agree"
                    checked={formik.values.agree}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <a href="/terms-of-service" target="_blank" rel="noreferrer" className="feedback-link">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/refund-policy" target="_blank" rel="noreferrer" className="feedback-link">
                      Privacy Policy
                    </a>
                  </Typography>
                }
              />
              {formik.touched.agree && formik.errors.agree && (
                <Alert severity="error" className="feedback-agree__error">
                  {formik.errors.agree}
                </Alert>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="feedback-submit-btn"
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FeedbackForm;
