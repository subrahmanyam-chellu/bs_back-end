import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HeroSection from './HeroSection';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import hero from '../assets/defaultprofile.jpg';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Footer from '../componets/Footer';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
const drawerWidth = 240;
const navItems = ['Latest Blogs', 'About', 'Contact'];


function DrawerAppBar(props) {
  const { window, pages = [] } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [settings, setSettings] = React.useState([{name:'profile', value:'/profile'}]);
  const token = localStorage.getItem("x-token");
  const navigate = useNavigate();
  const {user } = React.useContext(UserContext);

  React.useEffect(() => {
    if (!token) {
      setSettings([...settings, {name:'Login', value:'/auth'}]);
    } else {
      setSettings([...settings, {name:'Logout', value:'/auth'}]);
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = ()=>{
    localStorage.removeItem("x-token");
    navigate('/auth');
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'right' }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={() => { handleDrawerToggle }}
        sx={{ display: { sm: 'none' } }}
      >
        <CloseIcon sx={{ color: 'black', fontSize: 40 }} />
      </IconButton>
      <Divider />
      <List>
        {pages.map((item) => (
          <ListItem key={item.pageName} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={()=>{navigate(`${item.pageAddress}`);}}>
              <ListItemText primary={item.pageName} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar sx={{ backgroundColor: 'black', boxShadow: '5px 5px 5px white' }}>
        <Toolbar sx={{ color: 'black', display: 'flex', justifyContent: { xs: 'space-between', sm: 'space-between' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' }, border: 'none', '&:focus': { outline: 'none' }, }}
          >
            <MenuIcon sx={{ color: '#f4f4f4', border: 'none', fontSize: 32 }} />
          </IconButton>
          <Box>
            <Typography sx={{ backgroundColor: '#f2f2f2', p: { xs: 0.3, sm: 0.5 }, borderRadius: '5px', fontSize: { xs: 22, sm: 26 }, fontWeight: '800' }}><span style={{ backgroundColor: 'black', color: 'white', fontSize: { xs: 22, sm: 26 }, fontWeight: '800' }}>Blog</span><span style={{ backgroundColor: '#f70202', fontSize: { xs: 22, sm: 26 }, fontWeight: '800' }}>Spot</span></Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 3 }}>
            {pages.map((item) => (
              <Button key={item.pageName} sx={{ color: '#fff', fontSize:16 }} onClick={()=>{navigate(`${item.pageAddress}`)}}>
                {item.pageName}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: 'white' }}>Hey hai !</Typography>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Profile" src={user.profileUrl || hero} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={()=>{handleCloseUserMenu(); if(setting.name==='Logout') handleLogout(); else navigate(`${setting.value}`); }}>
                  <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          anchor='left'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ overflowX: 'hidden', m: 0, p: 0, width: '100%' }}>
        <Toolbar />
        {props.children}
        <Footer/>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
