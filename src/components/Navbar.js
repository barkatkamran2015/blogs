import React, { useState, useEffect } from 'react';
import { auth } from '../Admin/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import imageLogo from '../assets/logo1.png';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Recipe', path: '/recipe' },
    { label: 'Blog', path: '/blog' },
    { label: 'Products Review', path: '/products-review' },
    { label: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => console.log('User signed out'))
      .catch((error) => console.error('Error signing out: ', error));
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="sticky" style={{ backgroundColor: '#0b9299' }}> {/* Change color here */}
      <Toolbar>
        {/* Logo */}
        <Typography 
  variant="h6" 
  style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }} // Align items vertically
>
  <Link to="/" style={{ textDecoration: 'none' }}>
    <img 
      src={imageLogo} 
      alt="Classy Mama Logo" 
      style={{ 
        height: '60px', 
        objectFit: 'contain', 
        marginTop: '8px' /* Moves logo down without changing navbar height */
      }} 
    />
  </Link>
</Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {menuItems.map((menu, index) => (
            <Button 
              key={index} 
              sx={{ 
                color: 'white', 
                margin: '0 8px', 
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <Link to={menu.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                {menu.label}
              </Link>
            </Button>
          ))}
          {!user ? (
            <>
              <Button sx={{ color: 'white', fontWeight: 'bold' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
              </Button>
              <Button sx={{ backgroundColor: '#FFD700', color: '#6A5ACD', fontWeight: 'bold', marginLeft: 1 }}>
                <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Signup</Link>
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} sx={{ color: 'white', fontWeight: 'bold' }}>
              Logout
            </Button>
          )}
        </Box>

        {/* Hamburger Menu */}
        <IconButton 
          edge="end" 
          color="inherit" 
          sx={{ display: { xs: 'block', md: 'none' } }} 
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
            <List>
              {menuItems.map((menu, index) => (
                <ListItem button key={index}>
                  <Link to={menu.path} style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItemText primary={menu.label} />
                  </Link>
                </ListItem>
              ))}
              {!user ? (
                <>
                  <ListItem button>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
                      <ListItemText primary="Login" />
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link to="/signup" style={{ textDecoration: 'none', color: 'black' }}>
                      <ListItemText primary="Signup" />
                    </Link>
                  </ListItem>
                </>
              ) : (
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
