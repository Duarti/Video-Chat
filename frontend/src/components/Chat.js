import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";

const ChatMessage = ({ message }) => (
  <div className={`chatMessage-${message.sender}`}>{message.text}</div>
);

const Chat = ({ message, messages, onMessageChange, onSendClick }) => {
  const enterPressHandler = (e) => {
    if (e.key === "Enter" && message !== "") {
      onSendClick();
    }
  };

  return (
    <div className="leftContainer">
      <h2 style={{ color: "white" }}>Chat</h2>
      <div className="chatContainer">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      <div className="chatInputContainer">
        <Input
          placeholder="Type something..."
          onChange={onMessageChange}
          value={message}
          onKeyDown={(e) => enterPressHandler(e)}
          className="chatInput"
        ></Input>
        <SendOutlined className="sendIcon" onClick={onSendClick} />
      </div>
    </div>
  );
};

export default Chat;
