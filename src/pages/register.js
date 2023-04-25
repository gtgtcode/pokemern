import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";

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
      history.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default Register;
