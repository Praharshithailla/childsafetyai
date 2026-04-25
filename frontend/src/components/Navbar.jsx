import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  return (
    <div className="navbar">

      <div className="left" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </div>

      <div className="right">
        <FaUserCircle />
        <span>Teacher</span>
      </div>

    </div>
  );
}

export default Navbar;