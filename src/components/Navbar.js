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
  const [mobileMenuOpen, setMobileMenuOpen] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && drawerOpen) {
        setDrawerOpen(false); // Close drawer on larger screens
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawerOpen]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => console.log('User signed out'))
      .catch((error) => console.error('Error signing out: ', error));
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const toggleMobileMenu = (menuLabel) => {
    setMobileMenuOpen((prev) => ({
      ...prev,
      [menuLabel]: !prev[menuLabel],
    }));
  };

  const closeNavbarAndNavigate = () => {
    setDrawerOpen(false);
    setMobileMenuOpen({}); // Reset dropdown state
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    {
      label: 'Recipe',
      dropdown: [
        { label: 'Food', path: '/food' },
        { label: 'Drinks', path: '/drinks' },
        { label: 'Dessert', path: '/dessert' },
      ],
    },
    { label: 'Blog', path: '/blog' },
    { label: 'Products Review', path: '/products-review' },
    { label: 'A.I Style Advisor', path: '/style-advisor' },
    { label: 'Contact', path: '/contact' },
  ];

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
              alt="Logo"
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
  {menuItems.map((menu, index) =>
    menu.dropdown ? (
      <Box key={index} sx={{ position: 'relative' }}>
        {/* Dropdown Toggle */}
        <Button
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation
            toggleMobileMenu(menu.label); // Toggle the dropdown menu
          }}
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
          }}
        >
          {menu.label}
        </Button>

        {/* Dropdown Menu */}
        {mobileMenuOpen[menu.label] && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: '#0b9299',
              zIndex: 1,
              borderRadius: '4px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            {menu.dropdown.map((item, idx) => (
              <Button
                key={idx}
                component={Link}
                to={item.path}
                onClick={() => {
                  // Navigate and close the dropdown
                  setMobileMenuOpen({}); // Close dropdown
                }}
                sx={{
                  display: 'block',
                  color: 'white',
                  padding: '8px 16px',
                  textAlign: 'left',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    ) : (
      <Button
        key={index}
        component={Link}
        to={menu.path}
        sx={{
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'none',
        }}
      >
        {menu.label}
      </Button>
    )
  )}
  {!user ? (
    <>
      <Button
        component={Link}
        to="/login"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'none',
        }}
      >
        Sign In
      </Button>
      <Button
        component={Link}
        to="/signup"
        sx={{
          backgroundColor: '#FFD700',
          color: '#6A5ACD',
          fontWeight: 'bold',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#E5C300',
          },
        }}
      >
        Sign Up
      </Button>
    </>
  ) : (
    <Button
      onClick={handleLogout}
      sx={{
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'none',
      }}
    >
      Logout
    </Button>
  )}
</Box>

        {/* Mobile Menu */}
        <IconButton
          edge="end"
          onClick={toggleDrawer(true)}
          sx={{
            display: { xs: 'block', md: 'none' },
            border: '2px solid white',
            borderRadius: '50%',
            padding: '8px',
            width: '50px',
            height: '50px',
            backgroundColor: '#0b9299',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <MenuIcon sx={{ fontSize: '24px', color: 'white' }} />
        </IconButton>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100vw',
              height: 'calc(100vh - 64px)',
              marginTop: '64px',
              backgroundColor: '#0b9299',
              padding: '16px',
              boxSizing: 'border-box',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingBottom: '16px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              Menu
            </Typography>
            <IconButton
              onClick={toggleDrawer(false)}
              sx={{
                position: 'absolute',
                top: '8px',
                right: '16px',
                color: 'white',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          <List>
            {menuItems.map((menu, index) =>
              menu.dropdown ? (
                <Box key={index}>
                  <ListItem
                    button
                    onClick={() => toggleMobileMenu(menu.label)}
                    sx={{ textDecoration: 'none', color: 'white' }}
                  >
                    <ListItemText
                      primary={menu.label}
                      primaryTypographyProps={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    />
                  </ListItem>
                  {mobileMenuOpen[menu.label] &&
                    menu.dropdown.map((item, idx) => (
                      <ListItem
                        key={idx}
                        button
                        component={Link}
                        to={item.path}
                        onClick={closeNavbarAndNavigate}
                        sx={{
                          pl: 4,
                          textDecoration: 'none',
                          color: 'white',
                        }}
                      >
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: '14px',
                          }}
                        />
                      </ListItem>
                    ))}
                </Box>
              ) : (
                <ListItem
                  button
                  key={index}
                  component={Link}
                  to={menu.path}
                  onClick={closeNavbarAndNavigate}
                  sx={{
                    textDecoration: 'none',
                    color: 'white',
                  }}
                >
                  <ListItemText
                    primary={menu.label}
                    primaryTypographyProps={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  />
                </ListItem>
              )
            )}
          </List>

          <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Sign In/Sign Up Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {!user ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  onClick={closeNavbarAndNavigate}
                  sx={{
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '5px',
                    padding: '8px 16px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    width: '80%',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  onClick={closeNavbarAndNavigate}
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#6A5ACD',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    width: '80%',
                    '&:hover': {
                      backgroundColor: '#E5C300',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  handleLogout();
                  closeNavbarAndNavigate();
                }}
                sx={{
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '5px',
                  padding: '8px 16px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  width: '80%',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
