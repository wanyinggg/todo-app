import * as XLSX from "xlsx";

// Function to format date as dd-mm-yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const GenerateReport = (tasks) => {
  const formattedTasks = tasks.map((task) => ({
    Task: task.text,
    "Due Date": task.dueDate ? formatDate(task.dueDate) : "", // Format the due date
    Category: task.category,
    Completed: task.completed ? "Yes" : "No",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedTasks);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
  XLSX.writeFile(workbook, "todo_list.xlsx");
};

export default GenerateReport;
