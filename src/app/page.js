"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TodoList from './components/Todolist';
import Calendar from './components/Calendar';
import { Box } from '@mui/material';

const Page = () => {
    const [view, setView] = useState(null); // Initially null to prevent rendering before the state is set
    const [loading, setLoading] = useState(true); // Loading state to wait for localStorage data

    // Load the last visited view from localStorage on component mount
    useEffect(() => {
        const savedView = localStorage.getItem("selectedView");
        if (savedView) {
            setView(savedView);
        } else {
            setView("To Do List"); // Fallback to "To Do List" if nothing is saved
        }
        setLoading(false); // Set loading to false once the data is loaded
    }, []);

    // Update localStorage whenever the view changes
    const handleViewChange = (newView) => {
        setView(newView);
        localStorage.setItem("selectedView", newView); // Save the selected view to localStorage
    };

    if (loading) {
        return <Box>Loading...</Box>; // Display a loading message while waiting for data
    }

    return (
        <Box sx={{
            display: 'flex', 
            height: '100%', 
          }}>
            {/* Pass the selected view to Sidebar */}
            <Sidebar selected={view} onSelect={handleViewChange} />
            <Box
                sx={{
                    flexGrow: 1,
                    padding: 4,
                }}
            >
                {view === "To Do List" ? <TodoList /> : <Calendar />}
            </Box>
        </Box>
    );
};

export default Page;
