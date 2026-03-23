import React from 'react'
import "../styles/Dashboard.css";
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useHook';
import { useNavigate } from "react-router";


const Header = () => {
    
  const { user } = useSelector((state) => state.auth);
  const { handleLogout} = useAuth();

  const navigate = useNavigate();

  const logout = () =>{
    handleLogout();
    navigate('/login')
  }

  return (
    <div>
      
         <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-subtle)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="logo animate-pulse-slow" />
            <span className="text-xs text-[var(--text-muted)] font-mono">
              perplexity.ai
            </span>
          </div>
          <div className="flex items-center gap-3">
            
            <h2 className='text-[12px]'>Hey <span className='wave text-[20px]'>👋,</span>  <span className='text-gray-400'> {user.username} </span></h2>
            <button 
            onClick={logout}
            
            className="chip">
              LogOut
            </button>

          

          </div>
        </header>
    </div>
  )
}

export default Header
