import React from 'react'
import "../styles/Dashboard.css";
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useHook';
import { useNavigate } from "react-router";

const Header = ({ onMenuClick }) => {   // ← accept prop
  const { user } = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border-subtle)] flex-shrink-0">
      <div className="flex items-center gap-3">

        {/* ← Hamburger for mobile */}
        <button
          className="md:hidden action-btn w-8 h-8 flex items-center justify-center"
          onClick={onMenuClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div className="logo animate-pulse-slow" />
        <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:block">
          perplexity.ai
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <h2 className="text-[12px] hidden sm:block">
          Hey <span className="wave text-[20px]">👋</span>
          <span className="text-gray-400"> {user?.username}</span>
        </h2>
        {/* username only on mobile — shorter */}
        <span className="text-[12px] text-gray-400 sm:hidden">{user?.username}</span>
        <button onClick={logout} className="chip text-xs">
          LogOut
        </button>
      </div>
    </header>
  );
};

export default Header;