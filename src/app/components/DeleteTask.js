import React from 'react';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const DeleteTask = ({ onDelete, taskId }) => {
    const handleDelete = () => {
        onDelete(taskId); // Trigger the onDelete callback when delete button is clicked
    };

    return (
        <IconButton onClick={handleDelete}>
            <Delete />
        </IconButton>
    );
};

export default DeleteTask;
