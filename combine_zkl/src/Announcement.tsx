import { useNavigate } from "react-router-dom";

export default function Announcements() {
  interface Announcement {
    id: number;
    date: string;
    content?: string;
  }

  const announcements: Announcement[] = [
    { id: 1, date: "2025-08-15", content: "" },
    { id: 2, date: "2025-08-18", content: "" },
    { id: 3, date: "2025-08-20", content: "" },
  ];

  const navigate = useNavigate(); // <-- Add this line

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

          {/* Announcements header */}
          <h3 className="announcements-title">Announcements</h3>

          {/* Announcement cards */}
          <div className="announcements-list">
            {announcements.map(({ id, date, content }) => (
              <div key={id} className="announcement-card">
                <div className="announcement-date">{date}</div>
                <div className="announcement-content">{content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
