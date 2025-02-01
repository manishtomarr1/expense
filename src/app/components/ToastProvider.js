"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";
import React from "react";

function CustomCloseButton({ closeToast }) {
  return (
    <button
      onClick={closeToast}
      className="text-black ml-32 focus:outline-none"
      aria-label="Close"
    >
      <FaTimes size={14} />
    </button>
  );
}

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        closeOnClick
        pauseOnHover
        draggable
        closeButton={<CustomCloseButton />}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </>
  );
}
