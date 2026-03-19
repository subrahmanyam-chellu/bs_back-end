import React, { useContext, useEffect, useState } from 'react'
import DrawerAppBar from '../../componets/DrawerAppBar'
import Box from '@mui/material/Box'
import { jwtDecode } from 'jwt-decode';
import {UserContext} from '../../App';


const MainLayout = ({ children }) => {
  const [role, setRole] = useState();
  const [userId, setUserId] = useState();
  const {user} = useContext(UserContext);
  const [pages, setPages] = useState([]);
  const token = localStorage.getItem("x-token");

  useEffect(() => {
    userRole();
    if (role === 'admin') {
      const pages = [{
        pageName: "latest blogs",
        pageAddress: "/latestblogspage"
      },
      {
        pageName: "Drafts",
        pageAddress: "/draftspage"
      },
      {
        pageName: "Edit",
        pageAddress: "/editpage"
      },
      {
        pageName: "My blogs",
        pageAddress: "/myblogspage"
      },
      {
        pageName: "Delete",
        pageAddress: "/deletepage"
      },
      {
        pageName: "Create Blog",
        pageAddress: "/create"
      }
      ];
      setPages(pages);
    }
    else if (role === 'editor') {
      const pages = [{
        pageName: "latest blogs",
        pageAddress: "/latestblogspage"
      },
      {
        pageName: "Drafts",
        pageAddress: "/draftspage"
      },
      {
        pageName: "Edit",
        pageAddress: "/editpage"
      }
      ];
      setPages(pages);
    }
    else if (role === 'author') {
      const pages = [{
        pageName: "latest blogs",
        pageAddress: "/latestblogspage"
      },
      {
        pageName: "My blogs",
        pageAddress: "/myblogspage"
      },
      {
        pageName: "Create Blog",
        pageAddress: "/create"
      }
      ];
      setPages(pages);
    }
    else if (role === 'user')  {
      const pages = [{
        pageName: "latest blogs",
        pageAddress: "/latestblogspage"
      }
      ];
      setPages(pages);
    }else{
      const pages = [{
        pageName:"Login",
        pageAddress:"/auth"
      },
      {
        pageName:"Singup",
        pageAddress:"/auth"
      }
    ];
      setPages(pages);
    }
  }, [role]);

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
        else if (decode.userRole.toLowerCase() === 'user') {
          setRole("user");
        }
        else {
          setRole("no");
        }
      }else{
        localStorage.removeItem("x-token");
      }
    }
  };
  return (
    <>
      <DrawerAppBar user={user} pages={pages}>
        {children}
      </DrawerAppBar>

    </>
  )
}

export default MainLayout
