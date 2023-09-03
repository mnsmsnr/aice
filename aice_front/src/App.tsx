import React, { useState } from "react";
import { BrowserRouter, Routes, Route ,} from "react-router-dom";
import { Header } from "./component/layout/Header.tsx";
import { Footer } from "./component/layout/Footer.tsx";
import { Home } from "./component/pages/Home.tsx";
import { Talk } from "./component/pages/Talk.tsx";
import { SignUp } from "./component/pages/SignUp.tsx";
import { Profile } from "./component/pages/Profile.tsx";
import { MySetting } from "./component/pages/MySetting.tsx";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const App: React.FC = () => {

  const [tranceFlg, setTranceFlg] = useState(true);
  const [adviceFlg, setAdviceFlg] = useState(true);

  // tranceFlg 切り替えハンドラ
  const handleTranceFlgChange = () => {
    setTranceFlg(!tranceFlg);
  };

  // adviceFlg 切り替えハンドラ
  const handleAdviceFlgChange = () => {
    setAdviceFlg(!adviceFlg);
  };

  const appStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // 画面の高さに合わせる
  };

  const headerStyle: React.CSSProperties = {
    height: '5%', // 画面の高さの5%
    width: '100%', // 画面の幅に合わせる
  };

  const routesStyle: React.CSSProperties = {
    height: '90%', // 画面の高さの90%
    width: '100%', // 画面の幅に合わせる
    overflowY: 'auto', // コンテンツが収まらない場合に縦スクロールを有効にする
  };

  const footerStyle: React.CSSProperties = {
    height: '5%', // 画面の高さの5%
    width: '100%', // 画面の幅に合わせる
  };

  return (
      <BrowserRouter>
        <div style={appStyle}>
          <Header
            style={headerStyle}
            onTranceFlgChange={handleTranceFlgChange}
            onAdviceFlgChange={handleAdviceFlgChange}
            tranceFlg={tranceFlg}
            adviceFlg={adviceFlg}
          />
          <div style={routesStyle}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path={`/Talk/`} element={<Talk tranceFlg={tranceFlg} adviceFlg={adviceFlg} />} />
              <Route path={`/SignUp/`} element={<SignUp />} />
              <Route path={`/Profile/`} element={<Profile />} />
              <Route path={`/MySetting/`} element={<MySetting />} />
            </Routes>
          </div>
          <Footer style={footerStyle} />
        </div>
      </BrowserRouter>
  );
}
