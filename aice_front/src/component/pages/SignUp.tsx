import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Slide,
  AlertTitle,
  CircularProgress,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

export const SignUp: React.FC = () => {
  // フォーム
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // スナックバー表示制御
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // 履歴管理用のオブジェクトを取得
  const navigate = useNavigate();
  // ローディングアニメーション
  const [loading, setLoading] = useState<boolean>(false);
  const overlayStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  } as const;

  function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
  }

  // APIリクエスト
  const req = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
  }

  // 新規登録
  const handleSubmit = async (event: React.FormEvent) => {
    try {
      setLoading(true);
      event.preventDefault();
      const response = await fetch('http://localhost:8000/api/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      if (response.ok) {
        // サクセスアラート
        setOpenSnackbar(true);
        // スライド通知
        setTransition(() => TransitionLeft);
        // ホームページへ遷移
        setTimeout(() => {
          navigate('/');
        }, 5000);
        
      } else {
        throw new Error("API request failed!");
      }
    } catch (error){
      console.error("API request failed:", error);
      setLoading(false);
    }
  };

  // スナックバーを閉じる処理
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // スライド通知アニメーション
  const [transition, setTransition] = React.useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3}>
        <div>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="first_name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="last_name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        TransitionComponent={transition}
      >
        <Alert
          severity="info"
          variant="filled"
          icon={<CheckCircleIcon fontSize="inherit" />}
        ><AlertTitle>Success!</AlertTitle>
          You have obtained an account<br/>
          2FA is not required<br/>
          <strong>Please log in!</strong>
        </Alert>
      </Snackbar>
      {loading && (
          <div style={overlayStyle}>
            <CircularProgress />
          </div>
        )}
    </Container>
  );
};
