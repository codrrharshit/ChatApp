import { Children, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import { BrowserRouter, Navigate, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import Chat from "./pages/chat";
import { useAppStore } from "./store";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const {userInfo}= useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const {userInfo,setUserInfo}=useAppStore();
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const getUserData=async()=>{
      try {
        const response=await apiClient.get(GET_USER_INFO,{withCredentials:true});
        if(response.status==200 && response.data.id){
          setUserInfo(response.data);
        }
        else{
          setUserInfo(undefined);
        }
        console.log({response});
      } catch (error) {
        console.log({error});
        setUserInfo(undefined);
      }finally{
        setLoading(false);
      }
    }
    if(!userInfo){
      getUserData();
    }
    else{
      setLoading(false)
    }
  },[userInfo,setUserInfo])

  if(loading){
    return <div>Loading......</div>
  }
  console.log(userInfo);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
