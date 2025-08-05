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

          {/* Sub-header */}
          <div className="mt-3 text-sm">Booking Page</div>

          {/* Title */}
          <div className="booking_title mb-4">
            <h2 className="text-center text-2xl font-bold tracking-wide">
              BOOK A<br />
              SWIMMING POOL
            </h2>
          </div>

          {/* Form */}
          <div className="booking-form space-y-4">
            {/* Date */}
            <div>
              <label className="text-sm text-red-400">Date</label>
              <div className="booking_form label">17 July, 2025</div>
            </div>

            {/* Time */}
            <div>
              <label className="text-sm text-red-400">Time</label>
              <div className="booking_form label">4:00pm - 5:00pm</div>
            </div>

            {/* Guests */}
            <div>
              <label className="text-sm text-red-400">Number of Guests</label>
              <div className="booking_form label">2</div>
            </div>

            {/* Button */}
            <div>
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <p />
              <button className="w-full bg-[#3a3d3f] text-white py-2 rounded-md hover:bg-[#2d3135] mt-2">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
