import React from "react";
import { useState } from "react";

const AddSong = ({ userId, onSubmit }) => {
  const [songTitle, setSongTitle] = useState("");
  const [songChoices, setSongChoices] = useState([]);
  const [songChoice, setSongChoice] = useState(-1);

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

  const handleSearch = async (event) => {
    event.preventDefault();
    const token = await getToken();
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          songTitle
        )}&type=track&market=US&limit=10`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        alert("Could not search for your song...");
        return;
      }
      const data = await response.json();
      const songs = data.tracks.items.map((track) => {
        const artistNames = track.artists
          .map((artist) => artist.name)
          .join(", ");
        const artistIds = track.artists.map((artist) => artist.id).join(", ");
        return {
          title: track.name,
          albumCover: track.album.images[0].url,
          artist: artistNames,
          artistId: artistIds,
          link: track.external_urls.spotify,
          uri: track.uri,
        };
      });
      setSongChoices(songs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setSongTitle(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const date = form.get("date");
    const description = form.get("description");
    const body = {
      title: songChoices[songChoice].title,
      albumCover: songChoices[songChoice].albumCover,
      artist: songChoices[songChoice].artist,
      artistId: songChoices[songChoice].artistId,
      link: songChoices[songChoice].link,
      uri: songChoices[songChoice].uri,
      description: description,
      date: date,
      userId: userId,
    };
    try {
      const response = await fetch("/api/addSong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        alert("Could not add song...");
        return;
      }
      const data = await response.json();
      setSongChoice(-1);
      onSubmit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mx-8 w-10/12 mt-10 p-6 bg-beige rounded-lg flex flex-row">
        <div className="flex-1 px-4">
          <h1 className="text-2xl font-bold mb-4">Add Song</h1>
          <form
            onSubmit={handleSearch}
            onKeyDown={handleKeyDown}
            className="mb-4"
          >
            <label htmlFor="title" className="block text-sm font-medium">
              Song Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              onChange={handleChange}
              placeholder="Song title..."
              required
              className="mt-1 p-2 block w-full border rounded-md shadow-sm"
            ></input>
            <button
              type="submit"
              id="searchSongButton"
              className="text-white py-2 px-4 rounded bg-purple text-cream hover:font-bold mt-4"
            >
              Search Song Title
            </button>
          </form>
          {songChoices.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Select a song:</h2>
              <ul className="bg-cream rounded-lg p-4">
                {songChoices.map((song, index) => (
                  <li
                    key={index}
                    onClick={() => setSongChoice(index)}
                    className={`p-2 cursor-pointer hover:bg-brown hover:text-cream rounded ${
                      songChoice === index ? "bg-brown text-cream" : ""
                    }`}
                  >
                    {`${song.title} by ${song.artist}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex-1 px-8">
          {songChoice != -1 && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="date" className="block text-sm font-medium">
                Date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="mt-1 p-2 block w-full border rounded-md shadow-sm"
              ></input>
              <label
                htmlFor="description"
                className="block text-sm font-medium mt-4"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="mt-1 p-2 block w-full border rounded-md shadow-sm"
              ></textarea>
              <button
                type="submit"
                className="text-white py-2 px-4 rounded bg-purple text-cream hover:font-bold mt-4"
              >
                Add Song
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSong;
