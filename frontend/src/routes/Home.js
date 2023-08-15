import { Button, Modal, Input } from "antd";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import "../App.css";

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
      <h1 style={{ color: "white" }}>Welcome</h1>
      <Button
        type="primary"
        onClick={onCreateRoomClick}
        style={{ backgroundColor: "white", color: "black" }}
      >
        Create Room
      </Button>
      <Button
        type="primary"
        onClick={onJoinRoomClick}
        style={{ backgroundColor: "white", color: "black" }}
      >
        Join Room
      </Button>
      <Modal
        title="Create Room"
        open={isCreateRoomModalOpen}
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
            style={{ backgroundColor: "#974EC3" }}
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
            style={{ backgroundColor: "#974EC3" }}
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
