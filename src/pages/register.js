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
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3/5 md:w-1/4 w-3/4 bg-gray-200 rounded-[40px]">
        <h1 className="text-center my-10 text-2xl">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-6">
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
          <div className="text-center mb-6">
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
          <div className="text-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="p-4 bg-red-600 text-white rounded-full"
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
