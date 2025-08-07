import React from "react";

const login: React.FC = () => {
  const navigateToPage = (boxNumber: number) => {
    const pages: { [key: number]: string } = {
      1: "/announcement.html",
      2: "/report",
      3: "/billing",
      4: "/voting",
      5: "/booking",
      6: "/more",
      9: "/login",
      10: "/signup",
    };

    const url = pages[boxNumber];
    if (url) window.location.href = url;
  };

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-screen">
          {/* App Header */}
          <header className="app-header flex items-center gap-2">
            <button
              onClick={() => (window.location.href = "/")}
              className="homepage"
            >
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
            <button className="grid-btn" onClick={() => navigateToPage(1)}>
              <img
                src="/announcement.png"
                alt="Announcements"
                style={{
                  display: "block",
                  margin: "0 auto",
                  width: 32,
                  height: 32,
                }}
              />
              {/* <p>Announcements</p> */}
            </button>
            <button className="grid-btn" onClick={() => navigateToPage(2)}>
              <img
                src="/report.png"
                alt="Report"
                style={{
                  display: "block",
                  margin: "0 auto",
                  width: 32,
                  height: 32,
                }}
              />
              {/* <p>Report</p> */}
            </button>
            <button className="grid-btn" onClick={() => navigateToPage(3)}>
              <img
                src="/billing.png"
                alt="Billing"
                style={{
                  display: "block",
                  margin: "0 auto",
                  width: 32,
                  height: 32,
                }}
              />
              {/* <p>Billing</p> */}
            </button>
            <button className="grid-btn" onClick={() => navigateToPage(4)}>
              <img
                src="/voting.png"
                alt="Voting"
                style={{
                  display: "block",
                  margin: "0 auto",
                  width: 32,
                  height: 32,
                }}
              />
              {/* <p>Voting</p> */}
            </button>
            <button className="grid-btn" onClick={() => navigateToPage(5)}>
              <img
                src="/booking.png"
                alt="Booking"
                style={{
                  display: "block",
                  margin: "0 auto",
                  width: 32,
                  height: 32,
                }}
              />
              {/* <p>Booking</p> */}
            </button>
            <button className="grid-btn" onClick={() => navigateToPage(6)}>
              <img
                src="/more.png"
                alt="More"
                style={{
                  display: "block",
                  margin: "0 auto",
                  width: 32,
                  height: 32,
                }}
              />
              {/* <p>More</p> */}
            </button>
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

export default login;
