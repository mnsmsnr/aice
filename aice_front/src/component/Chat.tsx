import React, { FC } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { UserIcon } from "./UserIcon.tsx";

type ChatProps = {
  messages: {
    sentence: string;
    trans: string | undefined;
    advice?: string | undefined;
  };
  sender: string;
  tranceFlg: boolean;
  adviceFlg: boolean;
};

export const Chat: FC<ChatProps> = ({ messages, sender, tranceFlg, adviceFlg }) => {
  const chatStyle = {
    width: "100%",
    display: "flex",
    justifyContent: sender !== "Bot" ? "flex-start" : "flex-end",
  } as const;

  const paperStyle = {
    marginTop: "1rem",
    marginBottom: "1rem",
    padding: "0.5rem",
    backgroundColor: sender !== "Bot" ? "#F3F3F3" : "#A0E0FF",
    borderRadius: "10px",
    maxWidth: "70%", // 最大幅を70%に制限
  } as const;

  const textStyle = {
    whiteSpace: "pre-line" as const,
  } as const;

  return (
    <div style={chatStyle}>
      {sender !== "Bot" && <UserIcon sender={sender} />}
      <Paper elevation={12} style={paperStyle}>
        <Typography variant="body1" style={textStyle}>
          {messages.sentence}
        </Typography>
        {tranceFlg && messages.trans && (
          <Typography variant="body1" style={textStyle}>
            {messages.trans}
          </Typography>
        )}
        {/* 【TODO!】精度不足のため実装見送り */}
        {/* {adviceFlg && messages.advice && (
          <Typography variant="body1" style={textStyle}>
            {messages.advice}
          </Typography>
        )} */}
      </Paper>
      {sender === "Bot" && <UserIcon sender={sender} />}
    </div>
  );
};
