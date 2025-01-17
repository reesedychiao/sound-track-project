"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const handelSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
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
        Log In
      </h1>
      <form
        onSubmit={handelSubmit}
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
        <button
          type="submit"
          className="border mt-8 px-8 hover:text-purple hover:bg-cream"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
