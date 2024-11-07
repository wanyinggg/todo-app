import React from 'react';
import { ListItem, ListItemText, Checkbox, IconButton, Box, Typography, Chip, Divider } from '@mui/material'; 
import { Edit, Delete } from '@mui/icons-material';

// Function to format the date as dd-mm-yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
    return (
        <Box>
            <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Checkbox
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)} // Mark as completed
                />
                <ListItemText
                    primary={task.text}
                    secondary={
                        <Typography variant="body2" color="textSecondary" component="div">
                            {task.dueDate && <Chip label={`Due: ${formatDate(task.dueDate)}`} sx={{ marginRight: 1 }} />}
                            {task.category && <Chip label={task.category} />}
                        </Typography>
                    }
                    style={{
                        textDecoration: task.completed ? 'line-through' : 'none', // Line-through when completed
                    }}
                />
                <Box>
                    <IconButton onClick={() => onEdit(task)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDelete(task.id)}>
                        <Delete />
                    </IconButton>
                </Box>
            </ListItem>
        </Box>
    );
};

export default TaskItem;
