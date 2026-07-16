import { BsChatDotsFill } from "react-icons/bs";
import "../styles/ChatButton.css";

const ChatButton = ({ setShowChat }) => {
  return (
    <button
      className="chat-toggle-button"
      onClick={() => {
        console.log("Chat Button Clicked");
        setShowChat(true);
      }}
    >
      <BsChatDotsFill className="chat-icon" />
    </button>
  );
};

export default ChatButton;