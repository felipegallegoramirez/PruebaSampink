"use client"

import React, { useState } from "react";
import logo from "@/public/placeholder-logo.svg";
import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Auth from "@/app/auth/page";
import Form from "@/app/form/page";
import List from "@/app/list/page";

export default function Home() {
   const [isHidden, setIsHidden] = useState(false);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  return (
    <Router>
      <div>
        <img onClick={toggleHidden} src={logo} className="logo" alt="Logo" />
        <nav id="Central" className={`CentralNav ${isHidden ? "Hidden" : ""}`}>
          <img onClick={toggleHidden} src={logo} className="logo" alt="Logo" />

          <div className="nav-superior">
            <Link to="/Login" onClick={toggleHidden}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                />
              </svg>
              <p>Login</p>
            </Link>

            <Link to="/Form" onClick={toggleHidden}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                />
              </svg>
              <p>Form</p>
            </Link>

            <Link to="/List" onClick={toggleHidden}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                />
              </svg>
              <p>List</p>
            </Link>
          </div>
        </nav>
    <div className="Content">
        <Routes >
          <Route path="/Login" element={<Auth />} />
          <Route path="/Form" element={<Form />} />
          <Route path="/List" element={<List />} />
        </Routes>
    </div>
      </div>
    </Router>
  );
}
