import { useState, useEffect } from "react";

export default function Navbar() {
  const [LoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  });

  return (
    <nav id="navbar">
      <div className="h-[70px] w-full bg-gray-200 relative">
        <ul className="float-right inline absolute top-1/2 -translate-y-1/2 right-10">
          {!LoggedIn && (
            <div>
              <li>
                <a href="/login" className="mr-6">
                  Login
                </a>
                <a href="/register">Register</a>
              </li>
            </div>
          )}
          {LoggedIn && (
            <div>
              <li>
                <a href="/logout">Logout</a>
              </li>
            </div>
          )}
        </ul>
        <img
          src="pokemern.png"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-[50px]"
        ></img>
      </div>
    </nav>
  );
}
