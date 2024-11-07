import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, Drawer, IconButton } from '@mui/material';
import { FormatListBulleted, CalendarToday, Menu } from '@mui/icons-material';

const Sidebar = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleNavigation = (page) => {
    onSelect(page); // Call the function passed from parent to set the view
    setOpen(false); // Close the drawer after selection on mobile
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <Box 
        sx={{ 
          display: { xs: 'block', sm: 'none' }, 
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1200, 
          padding: 1 
        }}
      >
        <IconButton onClick={() => setOpen(true)}>
          <Menu />
        </IconButton>
      </Box>

      {/* Sidebar Drawer for Mobile */}
      <Drawer 
        anchor="left" 
        open={open} 
        onClose={() => setOpen(false)} 
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      >
        <List>
          <ListItemButton onClick={() => handleNavigation("To Do List")} selected={selected === "To Do List"}>
            <FormatListBulleted style={{ marginRight: 8 }} />
            <ListItemText primary="To Do List" />
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigation("Calendar")} selected={selected === "Calendar"}>
            <CalendarToday style={{ marginRight: 8 }} />
            <ListItemText primary="Calendar" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Sidebar for Larger Screens */}
      <Box
        sx={{
          width: 250,
          backgroundColor: '#f4f4f4',
          padding: 2,
          borderRadius: 2,
          margin: 1,
          minHeight: '100vh',
          display: { xs: 'none', sm: 'block' }, // Hide for mobile
        }}
      >
        <List>
          <ListItemButton onClick={() => handleNavigation("To Do List")} selected={selected === "To Do List"}>
            <FormatListBulleted style={{ marginRight: 8 }} />
            <ListItemText primary="To Do List" />
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigation("Calendar")} selected={selected === "Calendar"}>
            <CalendarToday style={{ marginRight: 8 }} />
            <ListItemText primary="Calendar" />
          </ListItemButton>
        </List>
      </Box>
    </>
  );
};

export default Sidebar;
