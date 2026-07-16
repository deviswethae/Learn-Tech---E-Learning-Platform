import { useSelector } from "react-redux";
import AllRoute from "./routes/AllRoute";
import Navbar from "./components/UserComponents/UserNavbar";
import ChatPage from "./components/ChatPage";
import ChatButton from "./components/ChatButton";
import "./styles/ChatButton.css";
import { useState } from "react";

function App() {
  const userStore = useSelector((store) => store.UserReducer);
  const isAuthenticated = !!userStore?.role;
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="App">
      {(userStore?.role === "admin" || userStore?.role === "teacher" || userStore?.role === "student") && <Navbar />}
      <AllRoute setShowChat={setShowChat} />
      
      {isAuthenticated && <ChatButton setShowChat={setShowChat} />}
      
      {showChat && <ChatPage setShowChat={setShowChat} />}
    </div>
  );
}

export default App;