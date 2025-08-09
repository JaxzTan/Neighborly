import React from "react";
import { useNavigate } from "react-router-dom";

const AfterLogin: React.FC = () => {
  const navigate = useNavigate();

  const navigateToPage = (boxNumber: number) => {
    const pages: { [key: number]: string } = {
      1: "/announcement",
      2: "/marketplace",
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
          <header className="app-header flex items-center gap-2">
            <button onClick={() => navigate("/")} className="homepage">
              <img src="/house.png" alt="Home icon" className="logo" />
            </button>
            <h1 className="title">Neighborly</h1>
          </header>

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
                      "marketplace",
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

export default AfterLogin;
