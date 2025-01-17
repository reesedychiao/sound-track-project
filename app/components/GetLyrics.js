import React from "react";
import { useState } from "react";

const GetLyrics = ({ songTitle, songArtist }) => {
  const [lyrics, setLyrics] = useState("");

  const handleClick = async (event) => {
    event.preventDefault();
    console.log("PROPS:", songTitle, songArtist);
    const response = await fetch(
      `https://api.lyrics.ovh/v1/${songArtist}/${songTitle}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      setLyrics("No lyrics found for this song :(");
      return;
    }
    const data = await response.json();
    setLyrics(data.lyrics);
  };

  return (
    <div className="space-y-4 w-80">
      <button
        onClick={handleClick}
        className="ml-8 text-white py-2 px-4 rounded bg-purple text-cream hover:font-bold"
      >
        Song Lyrics
      </button>
      {lyrics && (
        <div className="ml-8 p-4 bg-gray-200 rounded-lg max-h-96 overflow-y-scroll">
          {lyrics.split("\n").map((line, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetLyrics;
