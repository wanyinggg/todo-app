import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import { Add, FileDownload, ArrowLeft, ArrowRight } from "@mui/icons-material";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"; 
import GenerateReport from "./GenerateReport";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import Filter from "./Filter";
import TaskItem from "./TaskItem";
import { v4 as uuidv4 } from "uuid";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(() => {
    const storedTasksPerPage = localStorage.getItem("tasksPerPage");
    return storedTasksPerPage ? JSON.parse(storedTasksPerPage) : 5;
  });
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("status");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    const storedTasksPerPage = localStorage.getItem("tasksPerPage");
    if (storedTasksPerPage) {
      setTasksPerPage(JSON.parse(storedTasksPerPage));
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("tasksPerPage", JSON.stringify(tasksPerPage));
  }, [tasksPerPage]);

  const handleTaskAdd = (task) => {
    const newTask = { id: uuidv4(), ...task, completed: false };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    setOpenDialog(false); 
  };

  const handleEditTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskToEdit.id ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
    setOpenDialog(false); 
    setTaskToEdit(null);
  };

  const handleTaskDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const handleTaskComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const exportToExcel = () => {
    GenerateReport(tasks);
  };

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const onDragEnd = (result) => {
    const { destination, source } = result;
  
    if (!destination || destination.index === source.index) return; // No change if dropped outside or in the same position
  
    const reorderedTasks = Array.from(filteredTasks); // Clone the filtered tasks array
    const [removed] = reorderedTasks.splice(source.index, 1); // Remove the dragged task
    reorderedTasks.splice(destination.index, 0, removed); // Insert the dragged task at the destination index
    
    setFilteredTasks(reorderedTasks); // Update the tasks state directly
  };
  

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header Section */}
      <Stack
        justifyContent="space-between"
        mb={3}
        direction={{ xs: "column", sm: "row" }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          To Do List
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setOpenDialog(true);
              setTaskToEdit(null);
            }}
            color="primary"
          >
            Add Task
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={exportToExcel}
            color="primary"
          >
            Export
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* Filter Section */}
      <Paper
        variant="contained"
        sx={{ p: 3, mb: 4, backgroundColor: "#f5f5f5" }}
      >
        <Filter
          tasks={tasks}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          setFilteredTasks={setFilteredTasks}
        />
      </Paper>

      {/* Drag-and-Drop List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps} sx={{transition: "background-color 0.5s ease",}}>
              {filteredTasks
                .slice(
                  (currentPage - 1) * tasksPerPage,
                  currentPage * tasksPerPage
                )
                .map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    onComplete={handleTaskComplete}
                    onEdit={(task) => {
                      setTaskToEdit(task);
                      setOpenDialog(true);
                    }}
                    onDelete={handleTaskDelete}
                  />
                ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {/* Pagination Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
      >
        {/* Tasks per Page Dropdown */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Tasks per Page</InputLabel>
          <Select
            value={tasksPerPage}
            onChange={(e) => setTasksPerPage(e.target.value)}
            label="Tasks per Page"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>

        {/* Pagination Buttons */}
        <Box display="flex" justifyContent="center" alignItems="center">
          <IconButton
            size="medium"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ArrowLeft />
          </IconButton>
          <Typography variant="body2" mx={2}>
            Page {currentPage} of {totalPages}
          </Typography>
          <IconButton
            size="medium"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ArrowRight />
          </IconButton>
        </Box>
      </Box>

      {/* Dialog for Add/Edit Task */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{taskToEdit ? "Edit Task" : "Add Task"}</DialogTitle>
        <DialogContent>
          {taskToEdit ? (
            <EditTask
              taskToEdit={taskToEdit}
              onEdit={handleEditTask}
              onCancel={() => setOpenDialog(false)}
              categories={["Work", "Urgent", "Personal", "Shopping"]}
            />
          ) : (
            <AddTask
              onAdd={handleTaskAdd}
              onCancel={() => setOpenDialog(false)}
              taskToEdit={null}
              categories={["Work", "Urgent", "Personal", "Shopping"]}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TodoList;
