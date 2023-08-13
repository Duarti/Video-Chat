import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="pageNotFoundContainer">
      <div className="pageNotFound">
        Page not found
        <Button onClick={() => navigate("/")} style={{ alignSelf: "center" }}>
          Go back home
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
