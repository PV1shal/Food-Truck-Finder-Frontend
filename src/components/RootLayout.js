// src/RootLayout.js

import { useTheme, ThemeProvider, createTheme } from '@mui/material';
import Head from 'next/head';
import React, { useState, createContext } from 'react';
import TopNav from './TopNav';

const ColorModeContext = createContext({ toggleColorMode: () => { }, darkMode: 'light' });

const RootLayout = ({ children }) => {
    const [darkMode, setDarkMode] = useState('light');
    const [searchLocation, setSearchLocation] = useState('');

    const toggleColorMode = () => {
        setDarkMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
    };

    const handleSearchLocation = (location) => {
        setSearchLocation(location);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode,
            primary: {
                main: darkMode === 'dark' ? '#ffffff' : '#000000',
            },
        },
    });

    const mainStyle = {
        backgroundColor: theme.palette.background.default,
        maxHeight: '100vh',
        color: theme.palette.primary.main,
    };

    return (
        <ColorModeContext.Provider value={{ toggleColorMode, darkMode }}>
            <div>
                <Head>
                    <title>Food Truck Finder</title>
                </Head>
                <TopNav onSearchChange={handleSearchLocation} />
                <ThemeProvider theme={theme}>
                    <main style={mainStyle}>
                        {React.Children.map(children, (child) => {
                            if (React.isValidElement(child)) {
                                return React.cloneElement(child, { searchLocation });
                            }
                            return child;
                        })}
                    </main>
                </ThemeProvider>
            </div>
        </ColorModeContext.Provider>
    );
};

export { ColorModeContext };
export default RootLayout;
