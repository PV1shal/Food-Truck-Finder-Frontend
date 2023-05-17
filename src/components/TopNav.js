// src/TopNav.js

import { AppBar, Button, InputAdornment, TextField, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useContext } from 'react';
import { ColorModeContext } from './RootLayout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';

const TopNav = ({ onSearchChange }) => {
    const { toggleColorMode } = useContext(ColorModeContext);
    const [darkMode, setDarkMode] = useState('dark');
    const [searchLocation, setSearchLocation] = useState();

    const handleToggleColorMode = () => {
        toggleColorMode();
        setDarkMode(darkMode === 'dark' ? 'light' : 'dark');
    };

    const handleOnChange = (e) => {
        setSearchLocation(e.target.value);
    };

    const handleSearchClick = () => {
        console.log(searchLocation);
        onSearchChange(searchLocation);
    };

    return (
        <AppBar position="static" sx={{ background: "black" }}>
            <Toolbar>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Food Truck Finder
                </Typography>

                <TextField
                    id="outlined-basic"
                    label="Search Location"
                    variant="outlined"
                    onChange={handleOnChange}
                    sx={{
                        background: "rgba(255, 255, 255, 0.9)",
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon
                                    onClick={handleSearchClick}
                                    sx={{
                                        ":hover": {
                                            cursor: "pointer",
                                        },
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button color="inherit" onClick={handleToggleColorMode} title='Change Theme'>
                    {darkMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default TopNav;
