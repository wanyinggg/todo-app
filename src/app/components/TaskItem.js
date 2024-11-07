import React from "react";
import { Box, Card, Chip, Typography, IconButton, Checkbox } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Draggable } from "@hello-pangea/dnd";

const TaskItem = ({ task, index, onComplete, onEdit, onDelete }) => {
  return (
    <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
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
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              borderRadius: 2,
              boxShadow: snapshot.isDragging ? 4 : 1,
              backgroundColor: task.completed ? "success.light" : "background.paper",
              transform: snapshot.isDragging
              ? "scale(1.02)"
              : "scale(1)",
            transition: snapshot.isDragging
              ? "none"
              : "box-shadow 0.2s ease, transform 0.2s ease",
            }}
          >
            {/* Task Content */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between", 
                flexDirection: { xs: "column", sm: "row" }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flexDirection: { xs: "column", sm: "row" },  mb: { xs: 1, sm: 0 } }}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => onComplete(task.id)}
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
                    minWidth: { xs: 100, sm: 100 }, 
                    marginBottom: { xs: 1, sm: 0 }, 
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    textDecoration: task.completed ? "line-through" : "none",
                    flexGrow: 1,
                  }}
                >
                  {task.text}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" }, 
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    marginRight: 2,
                    color: "text.secondary",
                    mb: { xs: 1, sm: 0 }, 
                  }}
                >
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton onClick={() => onEdit(task)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(task.id)} color="error" size="small">
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      )}
    </Draggable>
  );
};

export default TaskItem;
