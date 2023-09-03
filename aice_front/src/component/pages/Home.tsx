import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { Button, Typography } from '@mui/material';

export const Home: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
  }, []);

  // 【TODO!】暫定対応 getLoggedInUserInfoの共通化必要
  const button = sessionStorage.getItem('token') ? (
    <Button variant="contained" color="primary" size="large" component={Link} to="/Talk">
      TALK
    </Button>
  ) : (
    <Button variant="contained" color="primary" size="large" component={Link} to="/SignUp">
      SIGN UP
    </Button>
  );

  const containerStyle = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  } as const;

  const titleWrapperStyle = {
    textAlign: "left",
  } as const;

  const letterStyle = {
    marginRight: "1.0rem",
    lineHeight: 1.2,
  } as const;

  const iStyle = {
    marginLeft: "1.0rem",
    marginRight: "1.0rem",
    lineHeight: 1.2,
  } as const;

  const buttonWrapperStyle = {
    marginTop: "5%",
    textAlign: "center",
  } as const;

  const buttonStyle = {
    textAlign: "center",
  } as const;

  return (
    <div style={containerStyle}>
      <div style={titleWrapperStyle}>
        <Typography variant="h3" component="h1">
          <Typography variant="h1" component="span" color="primary" style={letterStyle}>
            A
          </Typography>
          rtificial
        </Typography>
        <Typography variant="h3" component="h1">
          <Typography variant="h1" component="span" color="primary" style={iStyle}>
            I
          </Typography>
          ntelligence
        </Typography>
        <Typography variant="h3" component="h1">
          <Typography variant="h1" component="span" color="primary" style={letterStyle}>
            C
          </Typography>
          hat
        </Typography>
        <Typography variant="h3" component="h1">
          <Typography variant="h1" component="span" color="primary" style={letterStyle}>
            E
          </Typography>
          nglish
        </Typography>
      </div>
      <div style={buttonWrapperStyle}>
        <div style={buttonStyle}> {button} </div>
      </div>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#004daa",
            },
            links: {
              color: "#004daa",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
     
    </div>
  );
}
