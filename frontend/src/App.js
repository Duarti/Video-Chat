// App.js
import { Routes, Route } from "react-router-dom";
import Room from "./routes/Room";
import Home from "./routes/Home";
import PageNotFound from "./components/PageNotFound";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="room/:roomId" element={<Room />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
