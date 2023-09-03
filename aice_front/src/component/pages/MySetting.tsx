import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

export const MySetting: React.FC = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  } as const;

  const textWrapperStyle = {
    textAlign: 'center',
    marginBottom: '1rem',
  } as const;

  const buttonWrapperStyle = {
    textAlign: 'center',
  } as const;

  return (
    <div style={containerStyle}>
      <div style={textWrapperStyle}>
        <Typography variant="h4">Coming Soon</Typography>
      </div>
      <div style={buttonWrapperStyle}>
        <Button variant="contained" color="primary" component={Link} to="/">
          Go to Home
        </Button>
      </div>
    </div>
  );
};

