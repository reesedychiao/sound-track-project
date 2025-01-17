"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import GetLyrics from "../../components/GetLyrics";
import Image from "next/image";
import SearchUser from "../../components/SearchUser";
import AddComment from "../../components/AddComment";
import OtherSongs from "@/app/components/OtherSongs";

const UserPage = () => {
  const [userData, setUserData] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [date, setDate] = useState("");
  const [addingComment, setAddingComment] = useState(null);
  const { username } = useParams();
  const [myUsername, setMyUsername] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/searchUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch searched user's data");
      }
      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/searchDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: date, userId: userData._id }),
      });
      if (!response.ok) {
        alert("Could not search date...");
        return;
      }
      const data = await response.json();
      setTracks(data.tracks || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const myUsername = localStorage.getItem("username");
    setMyUsername(myUsername);
    if (username) {
      fetchUserData();
    }
  }, [username]);

  useEffect(() => {
    if (userData && date) {
      fetchData();
    }
  }, [date, userData]);

  const handleCommentAdded = async () => {
    if (userData && date) {
      await fetchData();
      setAddingComment(null);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <div className="m-8">
      <div className="flex m-8 justify-between">
        <h1 className="text-4xl font-body-500 text-cream font-bold">
          Sound Track
        </h1>
        <h1 className="text-3xl font-body-500 text-cream font-semibold">
          Viewing {userData.username}'s profile
        </h1>
      </div>
      <SearchUser />
      <form className="mb-4 ml-8">
        <input
          type="date"
          onChange={handleChange}
          value={date}
          className="border p-2 rounded w-1/3 bg-beige border-beige"
        ></input>
      </form>
      {tracks.length > 0 && (
        <div className="space-y-4">
          {tracks.map((track) => {
            return (
              <div
                key={track.title}
                className="relative border p-8 rounded shadow-md flex flex-row mx-4 bg-beige border-beige"
              >
                <div className="flex flex-col items-center mx-8">
                  <a href={track.link}>
                    <Image
                      src={track.albumCover}
                      width={200}
                      height={200}
                      className="rounded"
                      alt={track.title}
                    />
                  </a>
                  <div className="flex flex-col items-center mt-4">
                    <h1 className="text-xl font-bold">{track.title}</h1>
                    <h2 className="text-lg mt-2">{track.artist}</h2>
                    <p className="mt-2">{`"${track.description}"`}</p>
                  </div>
                </div>
                <GetLyrics songTitle={track.title} songArtist={track.artist} />
                <OtherSongs
                  songTitle={track.title}
                  songArtistId={track.artistId}
                />
                <div className="ml-8">
                  <button
                    onClick={() => setAddingComment(track._id)}
                    className="text-white py-2 px-4 rounded bg-purple text-cream hover:font-bold"
                  >
                    Add Comment
                  </button>
                  {addingComment === track._id && (
                    <AddComment
                      date={date}
                      userId={userData._id}
                      songId={track._id}
                      myUsername={myUsername}
                      setAddingComment={setAddingComment}
                      onCommentAdded={handleCommentAdded}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {tracks.length === 0 && (
        <h1 className="ml-8 font-body-300 text-cream text-xl">
          No tracks found for this date...
        </h1>
      )}
    </div>
  );
};

export default UserPage;
