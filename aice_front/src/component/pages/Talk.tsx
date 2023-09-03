import React, { useState, useRef, useEffect, FC } from "react";
import { Textbox } from "../Textbox.tsx";
import { Chat } from "../Chat.tsx";
import CircularProgress from "@mui/material/CircularProgress";

type TalkProps = {
  tranceFlg: boolean;
  adviceFlg: boolean;
};

export const Talk: FC<TalkProps> = ({ tranceFlg, adviceFlg }) => {

  const chatHistoryRef = useRef<HTMLDivElement | null>(null); // チャット履歴の要素の参照を保持
  // チャット履歴を管理するstate
  const [chatHistory, setChatHistory] =
    useState<Array<{
      message: {
        sentence: string;
        trans: string | undefined;
        advice?: string | undefined;
      };
      sender: string
    }>>(JSON.parse(sessionStorage.getItem("chatHistory") || "[]")
  );

  useEffect(() => {
    console.log('■')
    // ページ描写時にチャット履歴を復元
    const storedChatHistory = JSON.parse(sessionStorage.getItem("chatHistory") || "[]");

    if (storedChatHistory.length === 0) {
      // セッションストレージにチャット履歴がない場合、APIから取得してセッションストレージに保存
      getChatHistory();
    } else {
      setChatHistory(storedChatHistory);
    }    
  }, []);
  const [loading, setLoading] = useState<boolean>(false);

  // チャット履歴を取得
  const getChatHistory = async () => {
    try {
      setLoading(true);

      const jwtToken = sessionStorage.getItem('token');
      const chatHistoryRes = await fetch("http://127.0.0.1:8000/api/get_chat_history", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + jwtToken
        }
      });

      if (chatHistoryRes.ok) {
        const retrievedChatHistory = await chatHistoryRes.json();
        setChatHistory(retrievedChatHistory);
        sessionStorage.setItem("chatHistory", JSON.stringify(retrievedChatHistory));
      } else {
        console.error("Failed to fetch chat history");
      }
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      setLoading(false);
    }
  };


  // チャット送信
  const exec = async (sendMsg: string, sender: string) => {
    const jwtToken = sessionStorage.getItem('token');
    try {
      setLoading(true);
      const openaiReq = {
        sendMsg: sendMsg,
      }
      // API実行
      const openaiRes = await fetch("http://127.0.0.1:8000/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+ jwtToken
        },
        body: JSON.stringify(openaiReq),
      });

      if (!openaiRes.ok) {
        throw new Error("chat API request failed!");
      }

      // レスポンス内容
      const resArr = await openaiRes.json();

      // 送信Chatコンポーネントセット
      const sendChat = resArr.sendChat;
      // 受信Chatコンポーネントセット
      const receiveChat = resArr.receiveChat;

      // 送信メッセージと受信メッセージを一度に追加
      const updatedChatHistory = [
        ...chatHistory,
        { message: sendChat, sender: sender },
        { message: receiveChat, sender: "Bot" },
      ];
      // チャット履歴更新
      setChatHistory(updatedChatHistory);
      sessionStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));

      const chatHistoryReq = {
        chatHistory: updatedChatHistory,
      }
      // チャット履歴保存
      const chatHistoryRes = await fetch("http://127.0.0.1:8000/api/save_chat_history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+ jwtToken
        },
        body: JSON.stringify(chatHistoryReq),
      });

      if (!chatHistoryRes.ok) {
        throw new Error("save_chat_history API request failed!");
      }

    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      setLoading(false);
        // チャット送信後にスクロールを最下部に移動
      if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  };

  const talkStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
  } as const;

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

  return (
    <div style={talkStyle}>
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {loading && (
          <div style={overlayStyle}>
            <CircularProgress />
          </div>
        )}
        {/* Chatコンポーネントを繰り返し表示 */}
        {chatHistory.map((chat, index) => (
          <Chat
            key={index}
            messages={chat.message}
            sender={chat.sender}
            tranceFlg={tranceFlg}
            adviceFlg={adviceFlg}
          />
        ))}
        {/* スクロール最下部への参照 */}
        <div ref={chatHistoryRef} />
      </div>
      <div style={{ position: "sticky", bottom: 0 }}>
        <Textbox onSend={exec} />
      </div>
    </div>
  );
};
