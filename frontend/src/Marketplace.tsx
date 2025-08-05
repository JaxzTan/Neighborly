import React from "react";

const Marketplace: React.FC = () => {
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
            <div className="flex items-center gap-2 ml-auto"></div>
          </header>

          {/* Subheading */}
          <div className="relative">
            <img src="menu.png" alt="menu logo" className="logo_menu" />
            <h1 className="title_marketplace">Marketplace</h1>
            <img
              src="messenger.png"
              alt="messenger logo"
              className="logo_messenger"
            />
          </div>

          {/* Search */}
          <div className="search">
            <input type="text" placeholder="Search" className="searchbox" />
          </div>

          {/* Popular Searches */}
          <div className="px-4 mb-4">
            <p className="search_text">Popular searches</p>
            <div className="flex_box_marketplace">
              {[1, 2, 3].map((i) => (
                <div key={i} className="popular-box">
                  {i}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Sell Items */}
          <div className="p-4">
            <button className="sell-button">
              <img
                src="/camera.png"
                alt="camera icon"
                className="camera-icon"
              />
              <span>SELL ITEMS</span>
            </button>
          </div>

          {/* Advertisements */}
          <div className="advertisement-container">
            <div className="advertisement-box">advertisements</div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center pb-4">
            {[0, 1, 2, 3, 4].map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === 0 ? "bg-black" : "bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
