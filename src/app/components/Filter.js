import React, { useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Filter = ({
  tasks,
  searchKeyword,
  setSearchKeyword,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  sortOrder,
  setSortOrder,
  setFilteredTasks,  // Callback to set filtered tasks in parent component
}) => {
  // Filter tasks based on the current search and other filters
  const getFilteredTasks = () => {
    return tasks
      .filter((task) => {
        // Search by task description (case insensitive)
        if (
          searchKeyword &&
          task.text &&
          !task.text.toLowerCase().includes(searchKeyword.toLowerCase())
        ) {
          return false;
        }
  
        // Filter by completion status when "status" category is selected
        if (filterCategory === "status") {
          if (filterStatus === "completed" && !task.completed) {
            return false;
          }
          if (filterStatus === "incomplete" && task.completed) {
            return false;
          }
        }
  
        // If filter by "dueDate" is selected, sorting will be handled separately
        return true;
      })
      .sort((a, b) => {
        // Sort by due date if 'dueDate' filter category is selected
        if (filterCategory === "dueDate") {
          if (sortOrder === "asc") {
            return new Date(a.dueDate) - new Date(b.dueDate);
          } else {
            return new Date(b.dueDate) - new Date(a.dueDate);
          }
        }
        return 0;
      });
  };
  

  // Whenever the filter criteria change, update the filtered tasks
  useEffect(() => {
    const filteredTasks = getFilteredTasks();
    console.log("Filtered Tasks:", filteredTasks); // Check if filteredTasks is correct
    setFilteredTasks(filteredTasks);
  }, [searchKeyword, filterCategory, filterStatus, sortOrder, tasks, setFilteredTasks]);
  

  return (
    <Box sx={{ marginBottom: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Search Bar */}
      <TextField
        label="Search by task name"
        variant="outlined"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <Tooltip title="Search">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          ),
        }}
      />

      {/* Filter Type Selector (Status or Due Date) and Conditional Filters */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        {/* Filter Type Selector */}
        <FormControl sx={{ width: '48%' }}>
          <InputLabel>Filter By</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Filter By"
          >
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
          </Select>
        </FormControl>

        {/* Conditional Filters based on selected Filter Type */}
        {filterCategory === "status" && (
          <FormControl sx={{ width: '48%' }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="incomplete">Incomplete</MenuItem>
            </Select>
          </FormControl>
        )}

        {filterCategory === "dueDate" && (
          <FormControl sx={{ width: '48%' }}>
            <InputLabel>Sort by Due Date</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Sort by Due Date"
            >
              <MenuItem value="asc">Ascending Order</MenuItem>
              <MenuItem value="desc">Descending Order</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>
    </Box>
  );
};

export default Filter;
