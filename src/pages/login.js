import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import Navbar from "./components/navbar";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
        pokemon {
          name
          level
        }
      }
    }
  }
`;

export default function Login() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await login({ variables: { username, password } });
      localStorage.setItem("token", data.login.token);
      localStorage.setItem("userId", data.login.user.id);
      console.log("User logged in:", data.login.user);

      router.push("/");
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[40px] bg-gray-200 p-10 md:w-1/4">
        <h1 className="mb-10 text-center text-2xl">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-center">
            <label htmlFor="username">Username:</label>
            <br />
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2"
            />
          </div>
          <div className="text-center">
            <label htmlFor="password">Password:</label>
            <br />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2"
            />
          </div>
          {error && <p>Error: {error.message}</p>}
          <div className="mt-10 text-center">
            <button
              type="submit"
              className="rounded-full bg-red-600 p-4 text-white"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
