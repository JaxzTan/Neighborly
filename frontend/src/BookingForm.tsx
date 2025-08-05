import React from "react";

const BookingForm: React.FC = () => {
  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-screen bg-[#556072] text-white p-4 font-serif">
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

          <div className="booking-subtitle">Booking Page</div>

          {/* Title */}
          <div className="booking-title">
            <h2>
              BOOK A<br />
              SWIMMING POOL
            </h2>
          </div>

          {/* Form */}
          <div className="booking-form">
            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <div className="form-value">17 July, 2025</div>
            </div>

            {/* Time */}
            <div className="form-group">
              <label className="form-label">Time</label>
              <div className="form-value">4:00pm - 5:00pm</div>
            </div>

            {/* Guests */}
            <div className="form-group">
              <label className="form-label">Number of Guests</label>
              <div className="form-value">2</div>
            </div>

            {/* Button */}
            <div className="form-group">
              <button className="submit-button">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
