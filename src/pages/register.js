import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import Navbar from "./components/navbar";

const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

function Register() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const [register, { loading, error }] = useMutation(REGISTER_USER);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: formData });
      localStorage.setItem("token", data.register.token);
      localStorage.setItem("userId", data.register.user.id);
      console.log(data);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="absolute left-1/2 top-1/2 h-3/5 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-[40px] bg-gray-200 md:w-1/4">
        <h1 className="my-10 text-center text-2xl">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-center">
            <label htmlFor="username">Username:</label>
            <br />
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-2"
              required
            />
          </div>
          <div className="mb-6 text-center">
            <label htmlFor="email">Email:</label>
            <br />
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2"
              required
            />
          </div>
          <div className="text-center">
            <label htmlFor="password">Password:</label>
            <br />
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2"
              required
            />
          </div>
          {error && <p>Error: {error.message}</p>}
          <div className="mt-10 text-center">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-red-600 p-4 text-white"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
