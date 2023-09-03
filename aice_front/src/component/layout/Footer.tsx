import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface FooterProps {
  style?: React.CSSProperties;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <>
      <AppBar component="footer" position="static" sx={{ backgroundColor: '#000000' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption">
              ©2023 masanori.manase
            </Typography>
          </Box>
        </Container>
      </AppBar>
    </>
  );
};
