"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const privacy = formData.get("privacy");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, privacy }),
      });
      if (response.ok) {
        router.push("/dashboard");
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div>
      <h1 className="text-center mt-36 mb-24 text-5xl text-cream font-body-700 font-bold">
        Sign Up
      </h1>
      <form
        onSubmit={handleSubmit}
        className="text-center flex-col text-cream font-body-300"
      >
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="border ml-8 text-purple"
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="border ml-8 mt-8 text-purple"
          ></input>
        </div>
        <div>
          <label htmlFor="privacy">Privacy:</label>
          <select name="privacy" required className="border ml-8 mt-8">
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
        <button
          type="submit"
          className="border px-8 mt-8 hover:bg-cream hover:text-purple"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
