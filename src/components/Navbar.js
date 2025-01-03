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
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import imageLogo from '../assets/logo1.png';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState({}); // Manage dropdown state for multiple menus
  const [hoverTimeout, setHoverTimeout] = useState(null); // Handle hover delays

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

  const handleOpenMenu = (event, menuLabel) => {
    setAnchorEl((prev) => ({ ...prev, [menuLabel]: event.currentTarget }));
    if (hoverTimeout) clearTimeout(hoverTimeout);
  };

  const handleCloseMenu = (menuLabel) => {
    const timeout = setTimeout(() => {
      setAnchorEl((prev) => ({ ...prev, [menuLabel]: null }));
    }, 200);
    setHoverTimeout(timeout);
  };

  const cancelClose = (menuLabel) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setAnchorEl((prev) => ({ ...prev, [menuLabel]: anchorEl[menuLabel] }));
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
  {menuItems.map((menu, index) =>
    menu.dropdown ? (
      <Box
        key={index}
        onMouseEnter={(e) => handleOpenMenu(e, menu.label)}
        onMouseLeave={() => handleCloseMenu(menu.label)}
      >
        {/* Wrap the Recipe Button with a Link */}
        <Button
          component={Link}
          to={menu.path || '/food'}
          aria-controls={`menu-${menu.label}`}
          aria-haspopup="true"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            backgroundColor: '#0b9299',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          {menu.label}
        </Button>
        <Menu
          id={`menu-${menu.label}`}
          anchorEl={anchorEl[menu.label]}
          open={Boolean(anchorEl[menu.label])}
          onClose={() => handleCloseMenu(menu.label)}
          MenuListProps={{
            onMouseEnter: () => cancelClose(menu.label),
            onMouseLeave: () => handleCloseMenu(menu.label),
          }}
          sx={{
            mt: 1,
            '& .MuiPaper-root': {
              backgroundColor: '#0b9299',
              color: 'white',
            },
            '& .MuiMenuItem-root': {
              '&:hover': {
                backgroundColor: '#0b9299',
              },
            },
          }}
        >
          {menu.dropdown.map((item, idx) => (
            <MenuItem
              key={idx}
              component={Link}
              to={item.path}
              onClick={() => handleCloseMenu(menu.label)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    ) : (
      <Button
        key={index}
        sx={{
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'none',
          backgroundColor: '#0b9299',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
        }}
        component={Link}
        to={menu.path}
      >
        {menu.label}
      </Button>
            )
          )}
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

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Menu Items */}
          <List>
            {menuItems.map((menu, index) =>
              menu.dropdown ? (
                <Box key={index} sx={{ pl: 3 }}>
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      mb: 1,
                    }}
                  >
                    {menu.label}
                  </Typography>
                  {menu.dropdown.map((item, idx) => (
                    <ListItem
                      button
                      key={idx}
                      component={Link}
                      to={item.path}
                      onClick={toggleDrawer(false)}
                      sx={{
                        pl: 4,
                        color: 'white',
                        textDecoration: 'none',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '14px',
                          fontWeight: 'normal',
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
              )
            )}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
