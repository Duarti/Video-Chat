import { Button, Modal, Input } from "antd";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import "../App.css";

// import "antd/dist/antd.css";

const Home = () => {
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [joinRoomId, setJoinRoomId] = useState(null);
  const navigate = useNavigate();

  const onCreateRoomClick = () => {
    setIsCreateRoomModalOpen(true);
    setCreatedRoomId(uuid());
  };

  const onJoinRoomClick = () => {
    setIsJoinRoomModalOpen(true);
  };

  const onJoinRoomConfirm = () => {
    navigate(`/room/${joinRoomId}`);
  };

  const handleOk = () => {};

  const handleCancel = () => {
    setIsCreateRoomModalOpen(false);
    setIsJoinRoomModalOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdRoomId);
  };

  const createHandleJoin = () => {
    navigate(`/room/${createdRoomId}`);
  };

  const onChangeHandler = (e) => {
    setJoinRoomId(e.target.value);
  };

  return (
    <div className="home-container">
      <h1>Welcome</h1>
      <Button type="primary" onClick={onCreateRoomClick}>
        Create Room
      </Button>
      <Button type="primary" onClick={onJoinRoomClick}>
        Join Room
      </Button>
      <Modal
        title="Create Room"
        open={isCreateRoomModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCopy}>
            Copy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={false}
            onClick={createHandleJoin}
          >
            Continue
          </Button>,
        ]}
      >
        <p>
          Room ID: <strong>{createdRoomId}</strong>
        </p>
      </Modal>
      <Modal
        title="Join Room"
        open={isJoinRoomModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={false}
            onClick={onJoinRoomConfirm}
          >
            Join Room
          </Button>,
        ]}
      >
        <p>Type the room ID you want to join.</p>
        <Input
          placeholder="Room ID..."
          onChange={onChangeHandler}
          value={joinRoomId}
        />
      </Modal>
    </div>
  );
};

export default Home;

// import React, { useState } from 'react';
// import { Button, Modal } from 'antd';

// const App: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   const showModal = () => {
//     setOpen(true);
//   };

//   const handleOk = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       setOpen(false);
//     }, 3000);
//   };

//   const handleCancel = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <Button type="primary" onClick={showModal}>
//         Open Modal with customized footer
//       </Button>
//       <Modal
//         open={open}
//         title="Title"
//         onOk={handleOk}
//         onCancel={handleCancel}
//         footer={[
//           <Button key="back" onClick={handleCancel}>
//             Return
//           </Button>,
//           <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
//             Submit
//           </Button>,
//           <Button
//             key="link"
//             href="https://google.com"
//             type="primary"
//             loading={loading}
//             onClick={handleOk}
//           >
//             Search on Google
//           </Button>,
//         ]}
//       >
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//       </Modal>
//     </>
//   );
// };

// export default App;
