import React from 'react'
import { router } from './app.routes'
import { RouterProvider } from "react-router"
import { useEffect } from 'react'
import { useAuth } from '../auth/hooks/useHook'

const App = () => {

  const { handleGetme }  = useAuth();

  useEffect(()=>{
    handleGetme()
  },[]);

  return (
    <RouterProvider  router={router}  />
  )
}

export default App
