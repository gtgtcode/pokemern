import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
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
      console.log("User logged in:", data.login.user);
      router.push("/");
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>Error: {error.message}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
