import React from "react";

const DeleteSong = ({ userId, songId, date, done }) => {
  const handleClick = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/deleteSong", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId, songId: songId, date: date }),
    });
    if (!response.ok) {
      alert("Could not delete song...");
      return;
    }
    const data = await response.json();
    done(true);
    return;
  };

  return (
    <div className="flex items-center mt-4">
      <button
        onClick={handleClick}
        className="bg-brown text-cream hover:font-extrabold py-1 px-4 rounded-md shadow-md absolute top-4 right-4"
      >
        -
      </button>
    </div>
  );
};

export default DeleteSong;
