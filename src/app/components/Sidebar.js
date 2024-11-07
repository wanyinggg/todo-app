"use client";
import React from 'react';
import { Box, List, ListItemButton, ListItemText } from '@mui/material';
import { FormatListBulleted, CalendarToday } from '@mui/icons-material';

const Sidebar = ({ selected, onSelect }) => {

    const handleNavigation = (page) => {
        onSelect(page); // Call the function passed from parent to set the view
    };

    return (
        <Box
            sx={{
                width: 250,
                backgroundColor: '#f4f4f4',
                padding: 2,
                borderRadius: 2,
                margin: 1,
                minHeight: '100vh',
            }}
        >
            <List>
                <ListItemButton
                    onClick={() => handleNavigation("To Do List")}
                    selected={selected === "To Do List"}
                    sx={{
                        backgroundColor: selected === "To Do List" ? '#d0d0d0' : 'inherit',
                        borderRadius: 1,
                    }}
                >
                    <FormatListBulleted style={{ marginRight: 8 }} />
                    <ListItemText primary="To Do List" />
                </ListItemButton>
                <ListItemButton
                    onClick={() => handleNavigation("Calendar")}
                    selected={selected === "Calendar"}
                    sx={{
                        backgroundColor: selected === "Calendar" ? '#d0d0d0' : 'inherit',
                        borderRadius: 1,
                    }}
                >
                    <CalendarToday style={{ marginRight: 8 }} />
                    <ListItemText primary="Calendar" />
                </ListItemButton>
            </List>
        </Box>
    );
};

export default Sidebar;
