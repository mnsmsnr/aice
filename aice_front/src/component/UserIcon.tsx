import React, { memo, FC } from 'react'
import Avatar from "@mui/material/Avatar";
import { Paper } from "@mui/material";

type Props = {
  size?: number;
  sender: string;
};

let avatarItem:{};

export const UserIcon: FC<Props> = memo((props) => {
  const { size = 50, sender } = props;

  function stringToColor(name: string) {
    // 渡された文字列から最初のイニシャルを取得
    const initials = name.trim().split('.').map(word => word[0]).join('');
    
    let hash = 0;
    let i;
  
    for (i = 0; i < initials.length; i += 1) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
  }

  function stringAvatar(name: string) {
    // ユーザーアバター
    if (name !== "Bot") {
      avatarItem = {
        sx: {
          bgcolor: stringToColor(name),
          width: size,
          height: size,
          border: 1
        },
        children: name,
        // 【TODO! ユーザー機能実装後に解除】
        // children: `${name.split(' ')[0][0]}.${name.split(' ')[1][0]}`,
      };
    // BOTアバター
    } else {
      avatarItem = {
        sx: {
          bgcolor: "#A0E0FF",
          width: size,
          height: size,
          border: 1
        },
        children: "GPT",
      };
    }
    return avatarItem;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper
        sx={{
          padding: "6px",
          margin: 1,
          borderRadius: "100%",
          bgcolor: "#757575",
        }}
      >
        <Avatar
          {...stringAvatar(sender)}
        />
      </Paper>
    </div>
  );
});
