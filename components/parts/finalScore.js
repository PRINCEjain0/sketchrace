import React from "react";

const FinalScore = ({ scores, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Final Scores</h2>
        <ul>
          {Object.keys(scores).map((player) => (
            <li key={player} className="text-lg mb-2">
              {player}: {scores[player]} points
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FinalScore;
