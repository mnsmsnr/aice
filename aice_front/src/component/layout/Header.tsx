import React, { useState, useEffect, MouseEvent, FC }from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FileCopyIcon from '@mui/icons-material/FileCopy';

interface HeaderProps {
  tranceFlg: boolean;
  adviceFlg: boolean;
  onTranceFlgChange: () => void;
  onAdviceFlgChange: () => void;
  style?: React.CSSProperties;
}

export const Header: FC<HeaderProps> = ({
  tranceFlg,
  adviceFlg,
  onTranceFlgChange,
  onAdviceFlgChange,
}) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  useEffect(() => {
    // ログイン状態判定
    getLoggedInUserInfo()
  }, []);

  // ログイン処理
  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, // ユーザー名
          password: password, // パスワード
        }),
      });     
      if (response.ok) {
        const data = await response.json();
        setAuth(true); // ログイン状態ON
        setDialogOpen(false); // ダイアログclose
        // セッションストレージにJWTトークンを保存
        sessionStorage.setItem('token', data.access_token);
        sessionStorage.setItem('initials', data.initials);
        // トーク画面に遷移
        setTimeout(() => {
          navigate('/Talk');
        }, 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch('http://localhost:8000/api/logout', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setAuth(false);
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('chatHistory')
      sessionStorage.removeItem('initials')
    } catch (error){
      console.error('Log error:', error);
    } finally {
      // ホーム画面に遷移
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 2000);
    }
  };

  // ログインユーザー情報の取得
  const getLoggedInUserInfo = async () => {
    const jwtToken = sessionStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/api/getLoggedInUserInfo', {
        headers: {
          'Authorization': 'Bearer ' + jwtToken, 
        },
      });

      if (response.ok) {
          const data = await response.json();
          setAuth(true);
          sessionStorage.setItem('initials', data.initials);
          // 【TODO!】アドバイスフラグと翻訳フラグの変更
      } else {
        setAuth(false);
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('chatHistory')
        sessionStorage.removeItem('initials')
        // ホーム画面に遷移
        setTimeout(() => {
          setLoading(false);
          navigate('/');
        }, 2000);
      } 
    } catch (error) {
      console.error('protected error:', error);
    }
  };

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // ログインダイアログopen
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  // ログインダイアログclose
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEmail('');
    setPassword('');
  };

  return (
    <Box>
      <FormGroup row={true}>
        <FormControlLabel
          control={
            <Switch
              checked={auth}
              onChange={auth ? handleLogout : handleDialogOpen}
              aria-label="login switch"
            />
          }
          label={auth ? 'Logout' : 'Login'}
          sx={{ mr: 'auto' }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={tranceFlg}
              onChange={onTranceFlgChange}
              aria-label="trans switch"
            />
          }
          label="translation"
        />
        {/* 【TODO!】精度不足のため実装見送り */}
        {/* <FormControlLabel
          control={
            <Switch
              checked={adviceFlg}
              onChange={onAdviceFlgChange}
              aria-label="advice switch"
            />
          }
          label="advice"
        /> */}
      </FormGroup>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              AICE
            </Link>
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {/* 未実装 */}
                <MenuItem onClick={handleClose}>
                  <Link to="/Profile">Profile</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/MySetting">My Setting</Link>
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <CopyToClipboard text="exsample@mail.co.jp">
            <IconButton>
              サンプルEmailコピー
              <FileCopyIcon />
            </IconButton>
          </CopyToClipboard>
          <CopyToClipboard text="password0001">
            <IconButton>
              サンプルpasswordコピー
              <FileCopyIcon />
            </IconButton>
          </CopyToClipboard>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
      {loading && (
        <div style={overlayStyle}>
          <CircularProgress />
        </div>
      )}
    </Box>
  );
};
