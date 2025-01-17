import React from "react";
import { useState } from "react";
import Image from "next/image";

const OtherSongs = ({ songTitle, songArtistId }) => {
  const [songs, setSongs] = useState([]);

  const getToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_CLIENT_SECRET}`,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }
    const data = await response.json();
    return data.access_token;
  };

  const handleClick = async (event) => {
    event.preventDefault();
    console.log(
      `ROUTE: https://api.spotify.com/v1/artists/${songArtistId}/top-tracks`
    );
    const token = await getToken();
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${songArtistId}/top-tracks`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      alert("Could not get artist's other songs...");
    }
    const data = await response.json();
    const filteredTracks = data.tracks.reduce((acc, track) => {
      if (acc.length === 5 || track.name === songTitle) {
        return acc;
      }
      return [...acc, track];
    }, []);
    setSongs(filteredTracks);
  };

  return (
    <div className="space-y-4 ml-8">
      <button
        onClick={handleClick}
        className="ml-8 text-white py-2 px-4 rounded bg-purple text-cream hover:font-bold"
      >
        See Artist's Songs
      </button>
      {songs && (
        <div className="ml-8">
          {songs.map((song) => (
            <a href={song.external_urls.spotify} key={song.name}>
              <div className="border border-beige rounded-lg p-4 flex flex-row items-center bg-white shadow-md hover:shadow-lg w-96">
                <Image
                  src={song.album.images[0].url}
                  width={50}
                  height={50}
                  className="rounded"
                  alt={song.name}
                />
                <div className="ml-8">
                  <h2 className="text-lg font-semibold">{song.name}</h2>
                  <h3 className="text-sm">{song.artists[0].name}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default OtherSongs;
