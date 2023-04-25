import Link from "next/link";
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
                <Link href="/login" className="mr-6">
                  Login
                </Link>
                <Link href="/register">Register</Link>
              </li>
            </div>
          )}
          {LoggedIn && (
            <div>
              <li>
                <Link href="/logout">Logout</Link>
              </li>
            </div>
          )}
        </ul>

        <Link href="/">
          <img
            src="pokemern.png"
            alt="PokeMERN logo"
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-[50px]"
          />
        </Link>
      </div>
    </nav>
  );
}
