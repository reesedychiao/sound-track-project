"use client";

import { useState, useEffect } from "react";
import AddSong from "../components/AddSong";
import SearchUser from "../components/SearchUser";
import Image from "next/image";
import DeleteSong from "../components/DeleteSong";
import GetLyrics from "../components/GetLyrics";
import Comments from "../components/Comments";
import OtherSongs from "../components/OtherSongs";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [addingSong, setAddingSong] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [date, setDate] = useState("");
  const [doneDeleting, setDoneDeleting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/getUser");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (date) {
      fetchTracks();
    }
  }, [date]);

  useEffect(() => {
    if (doneDeleting) {
      fetchTracks();
      setDoneDeleting(false);
    }
  }, [doneDeleting]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const fetchTracks = async () => {
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
  };

  const handleAddSong = () => {
    setAddingSong(false);
    fetchTracks();
  };

  const handleChange = (event) => {
    event.preventDefault();
    setDate(event.target.value);
  };

  return (
    <div>
      <div className="flex m-8 justify-between">
        <h1 className="text-4xl font-body-500 text-cream font-bold">
          Sound Track
        </h1>
        <h1 className="text-3xl font-body-500 text-cream font-semibold">
          {userData.username}
        </h1>
      </div>
      <SearchUser username={userData.username} />
      <div className="m-8">
        <form className="mb-4">
          <input
            type="date"
            onChange={handleChange}
            className="border p-2 rounded w-1/3 bg-beige border-beige"
          ></input>
        </form>
      </div>
      {tracks.length > 0 ? (
        <div className="space-y-4">
          {tracks.map((track) => {
            return (
              <div
                key={track._id}
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
                    <h1 className="text-3xl font-bold">{track.title}</h1>
                    <h2 className="text-xl mt-2">{track.artist}</h2>
                    <p className="mt-2">{`"${track.description}"`}</p>
                  </div>
                </div>
                <Comments
                  date={date}
                  userId={userData._id}
                  songId={track._id}
                />
                <GetLyrics songTitle={track.title} songArtist={track.artist} />
                <OtherSongs
                  songTitle={track.title}
                  songArtistId={track.artistId}
                />
                <DeleteSong
                  userId={userData._id}
                  songId={track._id}
                  date={date}
                  done={setDoneDeleting}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <h1 className="ml-8 font-body-300 text-cream text-xl">
          No tracks found for this date...
        </h1>
      )}
      {addingSong && <AddSong userId={userData._id} onSubmit={handleAddSong} />}
      <button
        onClick={() => setAddingSong(true)}
        className="m-8 bg-slate-200 py-2 px-4 rounded-full bg-beige hover:font-extrabold"
      >
        +
      </button>
    </div>
  );
};

export default Dashboard;
