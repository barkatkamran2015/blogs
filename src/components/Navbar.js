import React, { useState, useEffect } from 'react';
import { auth } from '../Admin/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
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
    <AppBar position="sticky" sx={{ backgroundColor: '#0b9299' }}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              src={imageLogo}
              alt="Classy Mama Logo"
              style={{
                height: '55px',
                objectFit: 'contain',
                marginTop: '8px',
              }}
            />
          </Link>
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {menuItems.map((menu, index) => (
            <Button
              key={index}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              }}
              component={Link}
              to={menu.path}
            >
              {menu.label}
            </Button>
          ))}
          {!user ? (
            <>
              <Button
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                sx={{
                  backgroundColor: '#FFD700',
                  color: '#6A5ACD',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#E5C300' },
                }}
                component={Link}
                to="/signup"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>

        {/* Hamburger Menu (Mobile) */}
        <IconButton
          edge="end"
          color="inherit"
          sx={{
            display: { xs: 'block', md: 'none' },
            border: '2px solid white',
            borderRadius: '50%',
            padding: '8px',
            width: '50px',
            height: '50px',
          }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon sx={{ fontSize: '24px' }} />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100vw',
              height: '100vh',
              background: 'linear-gradient(180deg, #0b9299, #005f63)',
              color: 'white',
              padding: '16px',
            },
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              paddingBottom: '16px',
            }}
          >
            {/* Logo aligned to the left */}
            <Box sx={{ flexGrow: 1 }}>
              <img
                src={imageLogo}
                alt="Classy Mama Logo"
                style={{ height: '40px', objectFit: 'contain', marginLeft: '15px' }}
              />
            </Box>
            <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Sign Up and Login Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {!user ? (
              <>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#6A5ACD',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    maxWidth: '300px',
                    width: '100%',
                    margin: '0 auto',
                    '&:hover': {
                      backgroundColor: '#E5C300',
                    },
                  }}
                  component={Link}
                  to="/signup"
                  onClick={toggleDrawer(false)}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#FFD700',
                    borderColor: '#FFD700',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    maxWidth: '300px',
                    width: '100%',
                    margin: '0 auto',
                    '&:hover': {
                      backgroundColor: '#E5C300',
                      borderColor: '#E5C300',
                    },
                  }}
                  component={Link}
                  to="/login"
                  onClick={toggleDrawer(false)}
                >
                  Log In
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  color: '#FFD700',
                  borderColor: '#FFD700',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  maxWidth: '300px',
                  width: '100%',
                  margin: '0 auto',
                  '&:hover': {
                    backgroundColor: '#E5C300',
                    borderColor: '#E5C300',
                  },
                }}
                onClick={() => {
                  handleLogout();
                  toggleDrawer(false);
                }}
              >
                Logout
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Menu Items */}
          <List>
            {menuItems.map((menu, index) => (
              <ListItem
                button
                key={index}
                component={Link}
                to={menu.path}
                onClick={toggleDrawer(false)}
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  padding: '12px 32px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ListItemText
                  primary={menu.label}
                  primaryTypographyProps={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
