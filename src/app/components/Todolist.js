import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Card,
  Chip,
  Stack,
  IconButton,
  Checkbox,
} from "@mui/material";
import { Add, FileDownload, Edit, Delete } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; //fork of react-beautiful-dnd
import GenerateReport from "./GenerateReport";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import Filter from "./Filter";
import { v4 as uuidv4 } from "uuid";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(() => {
    const storedTasksPerPage = localStorage.getItem("tasksPerPage");
    return storedTasksPerPage ? JSON.parse(storedTasksPerPage) : 5; 
  });  const [sortOrder, setSortOrder] = useState("asc");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("status");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // State for controlling the dialog

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
    setOpenDialog(false); // Close the dialog after adding task
  };

  const handleEditTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskToEdit.id ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
    setOpenDialog(false); // Close the dialog after editing task
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
    if (!destination || destination.index === source.index) return; // No change if dropped outside or at the same position
  
    // Create a new array with the updated order of tasks
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);
  
    // Update the tasks immediately without transition delay
    setTasks(reorderedTasks);
  };
  
  
  return (
    <Box sx={{ padding: 2 }}>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
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
        sx={{ p: 3, mb: 4, backgroundColor: "#f5f5f5",  }}
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
          {(provided, snapshot) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                padding: 0,
                minHeight: "100px",
                background: snapshot.isDraggingOver
                  ? "rgba(0, 0, 0, 0.02)"
                  : "transparent",
                transition: "background-color 0.2s ease",
              }}
            >
              {filteredTasks
                .slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage)
                .map((task, index) => (
                  <Draggable
                    key={task.id.toString()}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          mb: 2,
                          transition: "transform 0s",
                          position: 'relative',
                          zIndex: snapshot.isDragging ? 999 : 1,
                        }}
                      >
                        <Card
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 2,
                            borderRadius: 2,
                            boxShadow: snapshot.isDragging ? 4 : 1,
                            backgroundColor: task.completed
                              ? "success.light"
                              : "background.paper",
                            transform: snapshot.isDragging
                              ? "scale(1.02)"
                              : "scale(1)",
                            transition: snapshot.isDragging
                              ? "none"
                              : "box-shadow 0.2s ease, transform 0.2s ease",
                          }}
                        >
                          {/* Card content remains the same */}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                              checked={task.completed}
                              onChange={() => handleTaskComplete(task.id)}
                              color={task.completed ? "success" : "default"}
                              sx={{ marginRight: 2 }}
                            />

                            <Chip
                              label={task.category}
                              sx={{
                                marginRight: 2,
                                backgroundColor:
                                  task.category === "Work"
                                    ? "#1E90FF"
                                    : task.category === "Urgent"
                                    ? "#FF4500"
                                    : task.category === "Shopping"
                                    ? "#FFD700"
                                    : "#32CD32",
                                fontWeight: "bold",
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: "bold",
                                textDecoration: task.completed
                                  ? "line-through"
                                  : "none",
                                flexGrow: 1,
                              }}
                            >
                              {task.text}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              sx={{ marginRight: 2, color: "text.secondary" }}
                            >
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>

                            <IconButton
                              onClick={() => {
                                setTaskToEdit(task);
                                setOpenDialog(true);
                              }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => handleTaskDelete(task.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Card>
                      </Box>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </List>
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
          <Button
            variant="outlined"
            size="small"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt; {/* '<' symbol */}
          </Button>
          <Typography variant="body2" mx={2}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt; {/* '>' symbol */}
          </Button>
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
