// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Login from "./login"; // Make sure this file exists
// import Signup from "./Signup"; // Signup page not implemented

// 🏠 Home component
const Home: React.FC = () => {
  const navigate = useNavigate();

  const navigateToPage = (boxNumber: number) => {
    const pages: { [key: number]: string } = {
      1: "/announcement",
      2: "/report",
      3: "/billing",
      4: "/voting",
      5: "/booking",
      6: "/more",
      9: "/login",
      10: "/signup",
    };

    const path = pages[boxNumber];
    if (path) navigate(path);
  };

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-screen">
          {/* App Header */}
          <header className="app-header">
            <img src="/house.png" alt="Home icon" className="logo" />
            <h1 className="title">Neighborly</h1>
          </header>

          {/* Login/Signup */}
          <div className="auth-buttons">
            <button className="auth-btn" onClick={() => navigateToPage(9)}>
              Log in
            </button>
            <span className="divider">|</span>
            <button className="auth-btn" onClick={() => navigateToPage(10)}>
              Sign up
            </button>
          </div>

          {/* Icon Grid */}
          <div
            className="icon-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                className="grid-btn"
                onClick={() => navigateToPage(num)}
              >
                <img
                  src={`/${
                    [
                      "announcement",
                      "report",
                      "billing",
                      "voting",
                      "booking",
                      "more",
                    ][num - 1]
                  }.png`}
                  alt={`Icon ${num}`}
                  style={{
                    display: "block",
                    margin: "0 auto",
                    width: 32,
                    height: 32,
                  }}
                />
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="footer">
            <h2>
              Build Trust Where
              <br />
              It Matters Most
            </h2>
            <p>
              Blockchain powered platform for private communities to manage
              data, payments, and voting – without a central admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🌐 App with routes
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> Signup route removed */}
        <Route
          path="/announcement"
          element={<div>Announcement Page (Coming Soon)</div>}
        />
        {/* Optional */}
        {/* You can add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
