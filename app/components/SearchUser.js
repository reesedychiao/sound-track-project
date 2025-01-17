import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchUser = ({ username }) => {
  const [searchedUser, setSearchedUser] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/searchUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: searchedUser }),
      });
      if (!response.ok) {
        alert("Could not find user...");
        return;
      }
      const data = await response.json();
      if (data.user.privacy !== "public") {
        alert("User's profile is private...");
        return;
      }
      localStorage.setItem("username", username);
      router.push(`/users/${searchedUser}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setSearchedUser(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="m-8">
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <input
          type="text"
          name="searchedUser"
          placeholder="Search user..."
          onChange={handleChange}
          className="bg-beige placeholder-black rounded-3xl p-2 w-full focus:outline-none focus:ring-2"
        ></input>
      </form>
    </div>
  );
};

export default SearchUser;
