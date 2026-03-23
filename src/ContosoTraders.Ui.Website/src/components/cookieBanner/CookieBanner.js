import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import './cookieBanner.scss';

const COOKIE_KEY = 'cookie_consent';

function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(COOKIE_KEY));

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Box className="cookie-banner">
      <Box className="cookie-banner__content">
        <CookieIcon className="cookie-banner__icon" />
        <Typography className="cookie-banner__text">
          We use cookies to improve your experience on our site. Do you accept cookies?
        </Typography>
      </Box>
      <Box className="cookie-banner__actions">
        <Button variant="outlined" className="cookie-banner__btn-decline" onClick={handleDecline}>
          Decline
        </Button>
        <Button variant="contained" className="cookie-banner__btn-accept" onClick={handleAccept}>
          Accept
        </Button>
      </Box>
    </Box>
  );
}

export default CookieBanner;
