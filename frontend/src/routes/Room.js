import "../App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Peer from "peerjs";
import Chat from "../components/Chat";
import RoomFull from "../components/RoomFull";
import WaitingUserText from "../components/WaitingUserText";

const socket = io("http://localhost:4000");

const Room = () => {
  const { roomId } = useParams();
  const [roomFull, setRoomFull] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [otherUserJoined, setOtherUserJoined] = useState(false);

  const onMessageChange = (e) => {
    setMessage(e.target.value);
  };

  socket.on("room-full", () => {
    setRoomFull(true);
  });

  const onSendClick = () => {
    if (!message) return;
    socket.emit("send-message", message);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "me", text: message },
    ]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "other", text: message },
      ]);
    });

    socket.on("user-disconnected", () => {
      setOtherUserJoined(false);
    });

    const peers = {};
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const myPeer = new Peer(undefined);

        myPeer.on("open", (id) => {
          if (!roomFull) {
            socket.emit("join-room", roomId, id);
          }
        });

        myPeer.on("error", (err) => {
          console.error(err);
        });

        addMyVideoStream(stream);

        myPeer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userVideoStream) => {
            addVideoStream(userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(myPeer, userId, stream);
        });
      });

    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });

    const connectToNewUser = (myPeer, userId, stream) => {
      const call = myPeer.call(userId, stream);

      call.on("stream", (userVideoStream) => {
        addVideoStream(userVideoStream);
      });
      call.on("close", () => {});

      peers[userId] = call;
    };

    const addVideoStream = (stream) => {
      const otherVideo = document.querySelector("#otherVideo");
      otherVideo.srcObject = stream;
      setOtherUserJoined(true);
    };

    const addMyVideoStream = (stream) => {
      const myVideo = document.querySelector("#myVideo");
      myVideo.muted = true;
      myVideo.srcObject = stream;
    };
  }, []);

  const chatContainer = document.querySelector(".chatContainer");

  useEffect(() => {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="App">
      <div className="container">
        {otherUserJoined && !roomFull && (
          <Chat
            message={message}
            onMessageChange={onMessageChange}
            onSendClick={onSendClick}
            messages={messages}
          />
        )}
        <div
          className="videoContainer"
          style={!otherUserJoined ? { width: "100%" } : {}}
        >
          <div class="myVideoContainer">
            <video
              width="400"
              height="450"
              id="myVideo"
              autoplay="true"
            ></video>
          </div>
          {!roomFull ? (
            <div className="otherVideoContainer">
              <video
                width="400"
                height="450"
                id="otherVideo"
                autoplay="true"
                style={{ display: otherUserJoined ? "block" : "none" }}
              ></video>
              {!otherUserJoined && <WaitingUserText />}
            </div>
          ) : (
            <RoomFull />
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
