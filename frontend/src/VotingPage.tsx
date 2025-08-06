import React, { useState } from "react";

interface Poll {
  id: number;
  question: string;
  options: string[];
  votedOption?: number;
  showResult?: boolean;
}

const VotingPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 1,
      question: "Should we allow pets in the community park?",
      options: ["Yes", "No", "Undecided"],
    },
    {
      id: 2,
      question: "Preferred timing for weekly maintenance?",
      options: ["Morning", "Afternoon", "Evening"],
    },
  ]);

  const handleVote = (pollId: number, optionIndex: number) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? { ...poll, votedOption: optionIndex, showResult: true }
          : poll
      )
    );
  };

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-screen">
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

          {/* Page Title */}
          <h2 className="text-center text-xl mt-4 mb-4 font-bold tracking-wide">
            COMMUNITY POLLS
          </h2>

          {/* Polls List */}
          {polls.map((poll) => (
            <div key={poll.id} className="poll-container">
              <h3 className="font-bold mb-2">{poll.question}</h3>
              {!poll.showResult ? (
                <>
                  {poll.options.map((option, index) => (
                    <button
                      key={index}
                      className="poll-option"
                      onClick={() => handleVote(poll.id, index)}
                    >
                      {option}
                    </button>
                  ))}
                </>
              ) : (
                <div>
                  <p className="poll-result">
                    You voted: {poll.options[poll.votedOption!]}
                  </p>
                  <p className="text-sm italic text-gray-600">
                    (Sample results only. Not stored.)
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
