// src/TopNav.js

import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useContext } from 'react';
import { ColorModeContext } from './RootLayout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const TopNav = () => {
    const { toggleColorMode } = useContext(ColorModeContext);
    const [darkMode, setDarkMode] = useState('dark');

    const handleToggleColorMode = () => {
        toggleColorMode();
        setDarkMode(darkMode === 'dark' ? 'light' : 'dark');
    };

    return (
        <AppBar position="static" sx={{ background: "black" }}>
            <Toolbar>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Food Truck Finder
                </Typography>
                <Button color="inherit" onClick={handleToggleColorMode} title='Change Theme'>
                    {darkMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default TopNav;
