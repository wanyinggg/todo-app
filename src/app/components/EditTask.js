import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EditTask = ({ taskToEdit, onEdit, onCancel, categories }) => {
    const [taskText, setTaskText] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (taskToEdit) {
            setTaskText(taskToEdit.text);
            setDueDate(taskToEdit.dueDate);
            setCategory(taskToEdit.category);
        }
    }, [taskToEdit]);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const handleEdit = () => {
        if (taskText.trim() && dueDate && category) { // Check if all fields are filled
            onEdit({ text: taskText, dueDate, category });
        } else {
            alert('Please fill out all fields'); // Alert user if a field is missing
        }
    };

    return (
        <Box>
            <TextField
                variant="outlined"
                placeholder="Edit task..."
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                fullWidth
                required
            />
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                <FormControl sx={{ marginRight: 1, width: '200px' }}>
                    <TextField
                        variant="outlined"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                        // Disable dates before today
                        inputProps={{
                            min: today,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: '150px' }} required>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        label="Category"
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                <Button variant="outlined" color="primary" onClick={onCancel} sx={{ marginRight: 1 }}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleEdit}>
                    Update Task
                </Button>
            </Box>
        </Box>
    );
};

export default EditTask;
