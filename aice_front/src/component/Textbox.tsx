import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import InputAdornment from "@mui/material/InputAdornment";

type TextboxProps = {
  onSend: (reqMsg: string, sender: string|null) => void;
};

export const Textbox: React.FC<TextboxProps> = ({ onSend }) => {
  const [reqMsg, setInputValue] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    if (!reqMsg) return;
    // ユーザーイニシャル取得
    const initials = sessionStorage.getItem('initials')
    // 上位コンポーネントでAPI実行
    onSend(reqMsg , initials);

    // テキストフィールドをクリア
    setInputValue("");
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    // Enterで送信 shift+Enterで改行
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendClick();
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <TextField
        value={reqMsg}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        multiline
        minRows={1}
        maxRows={4}
        style={{ width: "70%", marginBottom: "1rem" }}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={handleSendClick} startIcon={<SendIcon />} disabled={!reqMsg}>
                送信
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};