import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Token = () => {
    
    const token = localStorage.getItem("x-token");
    const navigate = useNavigate();

    useEffect(()=>{
        userRole();
    },[]);

    const userRole = () => {
    if (token) {
      const decode = jwtDecode(token);
      if (decode.exp * 1000 > Date.now()) {
        setUserId(decode.userId);
        if (decode.userRole.toLowerCase() === 'admin') {
          setRole("admin");
        }
        else if (decode.userRole.toLowerCase() === 'editor') {
          setRole("editor");
        }
        else if (decode.userRole.toLowerCase() === 'author') {
          setRole("author");
        }
        else {
          setRole("user");
        }
      }
    }
    else {
        setRole('null');
        navigate('/auth');

    }
  };

  return (
    {userId, role}
  )
}

export default Token
