import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

console.log("io", io);

function App() {
  const [videoGrid, setVideoGrid] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");
    const myPeer = new Peer(undefined, {
      host: "/",
      port: "4001",
    });
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    const peers = {};
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);

        myPeer.on("call", (call) => {
          console.log("IN1");
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });

    myPeer.on("open", (id) => {
      socket.emit("join-room", 11, id);
    });

    function connectToNewUser(userId, stream) {
      console.log("IN2");
      console.log("HERE");
      const call = myPeer.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });

      peers[userId] = call;
    }

    function addVideoStream(video, stream) {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      setVideoGrid((prevGrid) => [...prevGrid, video]);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
