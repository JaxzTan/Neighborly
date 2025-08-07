import React from "react";

const Billing: React.FC = () => {
  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-screen billing-screen">
          {/* Header */}
          <header className="app-header flex items-center gap-2">
            <button
              onClick={() => (window.location.href = "/")}
              className="homepage"
            >
              <img src="/house.png" alt="Home icon" className="logo" />
            </button>
            <h1 className="title">Neighborly</h1>
          </header>

          <div className="billing-balance">
            {/* Arrow on the left */}
            <div className="arrow-wrapper">
              <button
                onClick={() => (window.location.href = "/")}
                className="homepage"
              >
                <img src="/arrow.png" alt="Back" className="back-arrow" />
              </button>
            </div>

            {/* Centered balance info */}
            <div className="billing-balance-content">
              <p className="account-label">(Account)</p>
              <h2 className="account-balance">RM XXXX</h2>
              <p className="transaction-history">view transaction history</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="billing-options">
            <div className="billing-button">
              <img src="/coin.png" alt="coin" className="billing-icon" />
              <span>SUI Coin</span>
            </div>
            <div className="billing-button">
              <img
                src="/credit-card.png"
                alt="credit card"
                className="billing-icon"
              />
              <span>Pending Payments</span>
            </div>
            <div className="billing-button">
              <img src="/invoice.png" alt="Utility" className="billing-icon" />
              <span>Utility bills</span>
            </div>

            {/* QR Scan Button */}
            <div className="qr-button">
              <img src="/scanner.png" alt="Scanner" className="scan-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
