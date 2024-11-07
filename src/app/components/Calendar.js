import React, { useMemo, useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Box, Typography, Stack, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const categoryColors = {
  Work: '#1E90FF',
  Personal: '#32CD32',
  Urgent: '#FF4500',
  Shopping: '#FFD700',
};

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const events = useMemo(() => {
    return tasks.map((task) => ({
      id: task.id, // Make sure each event has a unique ID
      title: task.text,
      start: new Date(moment(task.dueDate).startOf('day').toDate()),
      end: new Date(moment(task.dueDate).endOf('day').toDate()), // Set end time to end of day
      color: categoryColors[task.category] || '#808080',
      allDay: true,
      resource: task, // Store the original task data
    }));
  }, [tasks]);

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  // Handle event selection (clicking on an existing event)
  const handleSelectEvent = (event) => {
    setSelectedDate({
      date: event.start,
      tasks: [event.resource],
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDate(null);
  };

  // Move to the next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  // Move to the previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  return (
    <Box >
      {/* Custom Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
        <IconButton onClick={handlePrevMonth}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">{moment(currentDate).format('MMMM YYYY')}</Typography>
        <IconButton onClick={handleNextMonth}>
          <ArrowForward />
        </IconButton>
      </Box>

      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh', backgroundColor: '#f4f4f4' }}
        eventPropGetter={eventStyleGetter}
        views={['month']}
        onSelectEvent={handleSelectEvent}
        selectable={true}
        popup={true}
        step={60}
        timeslots={1}
        defaultView="month"
        date={currentDate} // Set the current date to the custom one
        toolbar={false}
      />
      
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">Category Legend</Typography>
        <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
          {Object.entries(categoryColors).map(([category, color]) => (
            <Box key={category} display="flex" alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: color,
                  borderRadius: '50%',
                  marginRight: 1,
                }}
              />
              <Typography variant="body2">{category}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Tasks for {selectedDate ? moment(selectedDate.date).format('MMMM Do, YYYY') : ''}
        </DialogTitle>
        <DialogContent>
          <List>
            {selectedDate && selectedDate.tasks.map((task) => (
              <ListItem key={task.id}>
                <ListItemText
                  primary={task.text}
                  secondary={`Category: ${task.category}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Calendar;
