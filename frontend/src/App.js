import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const socket = io("http://localhost:4000");
const myPeer = new Peer(undefined, {
  host: "/",
  port: "4001",
});

function App() {
  // const [videoGrid, setVideoGrid] = useState([]);

  const [myVideoSource, setMyVideoSource] = useState(null);
  const [roomFull, setRoomFull] = useState(false);

  socket.on("room-full", () => {
    console.log("room full");
    setRoomFull(true);
  });

  console.log("room users", io);

  useEffect(() => {
    const peers = {};
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addMyVideoStream(stream);

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
      console.log("id", id);
      if (!roomFull) {
        socket.emit("join-room", 11, id);
      }
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

    const addVideoStream = (video, stream) => {
      const otherVideo = document.querySelector("#otherVideo");
      otherVideo.srcObject = stream;
    };

    const addMyVideoStream = (stream) => {
      const myVideo = document.querySelector("#myVideo");
      myVideo.muted = true;
      myVideo.srcObject = stream;
    };
  }, []);

  return (
    <div className="App">
      <div class="container">
        <div class="myVideoContainer">
          <video
            width="400"
            height="450"
            id="myVideo"
            // src="https://file-examples.com/storage/fe7bb0e37864d66f29c40ee/2017/04/file_example_MP4_640_3MG.mp4"
            src={myVideoSource}
            autoplay="true"
          ></video>
        </div>
        {!roomFull ? (
          <div class="otherVideoContainer">
            <video
              width="400"
              height="450"
              id="otherVideo"
              // src="https://file-examples.com/storage/fe7bb0e37864d66f29c40ee/2017/04/file_example_MP4_640_3MG.mp4"
              src={myVideoSource}
              autoplay="true"
            ></video>
          </div>
        ) : (
          <div>Room Full</div>
        )}
      </div>
    </div>
  );
}

export default App;
