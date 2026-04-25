import { FaHome, FaUserGraduate, FaChartBar, FaSignOutAlt } from "react-icons/fa";

function Sidebar() {

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sidebar">

      <h2 className="logo">CSAI</h2>

      <div className="menu">

        <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <FaHome /> Dashboard
        </div>

        <div onClick={() => scrollToSection("students-section")}>
          <FaUserGraduate /> Students
        </div>

        <div onClick={() => scrollToSection("analytics-section")}>
          <FaChartBar /> Analytics
        </div>

        <div onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}>
          <FaSignOutAlt /> Logout
        </div>

      </div>
    </div>
  );
}

export default Sidebar;