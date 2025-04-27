import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const WhatsAppWidget = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isInactive, setIsInactive] = useState(false);
  const [isClosed, setIsClosed] = useState(false); // New state to track if the widget is closed

  useEffect(() => {
    if (user && !isClosed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 13000);

      return () => clearTimeout(timer);
    }
  }, [user, isClosed]);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    if (isVisible) {
      inactivityTimer = setTimeout(() => {
        setIsInactive(true);
      }, 4000);
    }

    return () => clearTimeout(inactivityTimer);
  }, [isVisible, isInactive]);

  if (!user || !isVisible || isClosed) return null;

  const phoneNumber = "+2348111548492"; // Replace with your WhatsApp number
  const message =  "Hello! I need live support?";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      {isVisible && (
        <div
          className="fixed px-3 py-1 text-sm text-gray-800 bg-white border rounded-md shadow-lg bottom-16 right-4"
          style={{ opacity: isInactive ? 0.5 : 1, transition: "opacity 0.3s" }}
        >
          Click to chat with live agent!
        </div>
      )}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed p-3 text-white transition duration-300 bg-green-500 rounded-full shadow-lg bottom-4 right-4 hover:bg-green-600 ${
          isInactive ? "opacity-50" : "opacity-100"
        }`}
        title="Chat with us on WhatsApp"
        onMouseEnter={() => setIsInactive(false)} // Reset inactivity on hover
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-6 h-6 "
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.106 1.516 5.84L0 24l6.293-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.803 17.197c-.283.796-1.64 1.553-2.27 1.64-.583.08-1.283.113-2.06-.13-.477-.15-1.09-.35-1.87-.683-3.283-1.37-5.43-4.77-5.6-5.003-.17-.233-1.33-1.77-1.33-3.383 0-1.613.84-2.407 1.14-2.74.283-.33.62-.413.83-.413.21 0 .42.002.6.01.2.01.47-.08.74.57.283.67.96 2.33 1.04 2.5.08.17.13.37.03.6-.1.23-.15.37-.3.57-.15.2-.32.43-.46.57-.15.13-.3.27-.13.53.17.27.75 1.23 1.6 2 .97.87 1.8 1.13 2.07 1.27.27.13.43.1.6-.06.17-.17.7-.77.87-1.03.17-.27.37-.23.6-.13.23.1 1.47.7 1.73.83.27.13.43.2.5.33.07.13.07.77-.22 1.57z" />
        </svg>
      </a>
      {/* Close Button */}
      <button
        onClick={() => setIsClosed(true)} // Close the widget
        className="fixed p-1 text-red-500 bg-white rounded-full shadow-lg bottom-16 right-6 hover:bg-red-600"
        style={{ opacity: isInactive ? 0.5 : 1, transition: "opacity 0.3s" }}
        title="Close Widget"
      >
        ✕
      </button>{" "}
    </>
  );
};

export default WhatsAppWidget;
