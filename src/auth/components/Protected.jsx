import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import '../styles/Protected.css'

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <main className="h-screen w-full flex items-center justify-center">
        <svg className="svg" viewBox="0 0 638.54 568">
          <defs>
            <linearGradient
              id="g3"
              x1="76.85%"
              y1="110.31%"
              x2="23.15%"
              y2="-10.31%"
            >
              <stop stop-color="#00f" stop-opacity=".99" />
              <stop offset=".707" stop-color="#00f" stop-opacity="0" />
            </linearGradient>
            <linearGradient
              id="g2"
              x1="-5.92%"
              y1="7.86%"
              x2="105.92%"
              y2="92.14%"
            >
              <stop stop-color="#0f0" stop-opacity=".99" />
              <stop offset=".707" stop-color="#0f0" stop-opacity="0" />
            </linearGradient>
            <linearGradient
              id="g1"
              x1="92.14%"
              y1="-5.92%"
              x2="7.86%"
              y2="105.92%"
            >
              <stop stop-color="#f00" stop-opacity=".99" />
              <stop offset=".707" stop-color="#f00" stop-opacity="0" />
            </linearGradient>
            <radialGradient id="ground">
              <stop offset="0%" stop-color="#fff" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#fff" stop-opacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50%" cy="580" rx="700" ry="100" fill="url(#ground)" />
          <g class="triangle-scale-translate">
            <g class="triangle-rotate">
              <path
                fill="url(#g3)"
                d="M270.28,28.29L7.66,483.14c-21.78,37.72,5.44,84.86,48.99,84.86h525.22c43.55,0,70.77-47.14,48.99-84.86L368.26,28.29c-21.78-37.72-76.21-37.72-97.99,0Z"
              />
              <path
                fill="url(#g2)"
                d="M270.28,28.29L7.66,483.14c-21.78,37.72,5.44,84.86,48.99,84.86h525.22c43.55,0,70.77-47.14,48.99-84.86L368.26,28.29c-21.78-37.72-76.21-37.72-97.99,0Z"
              />
              <path
                fill="url(#g1)"
                d="M270.28,28.29L7.66,483.14c-21.78,37.72,5.44,84.86,48.99,84.86h525.22c43.55,0,70.77-47.14,48.99-84.86L368.26,28.29c-21.78-37.72-76.21-37.72-97.99,0Z"
              />
            </g>
          </g>
        </svg>
      </main>
      
    );
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Protected;
