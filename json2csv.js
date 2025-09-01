const { parse } = require("json2csv");
const fs=require('fs')


// Sample JSON (replace with your own or load from a file)
const students = [
  {
    "id": 1,
    "icard_number": "IC-0002",
    "student_id": "1c0d6131-7bf7-4b50-a5aa-56c1f90c6b98",
    "status": "REQUESTED",
    "name": "mutabazi ganza oneil",
    "level": "level 3",
    "class_name": "level 3 a",
    "room": "room 16",
    "teacher_name": "N/A",
    "avatar_url": "https://res.cloudinary.com/dmdxkhocb/image/upload/v1756116620/pnseekkg23pfnjuzzzg6.jpg"
  },
  {
    "id": 3,
    "icard_number": "IC-0004",
    "student_id": "76e7a09a-dbdc-47df-aff3-39e592d29787",
    "status": "REQUESTED",
    "name": "yakin nsannzumuhire",
    "level": "level 3",
    "class_name": "level 3 a",
    "room": "room 16",
    "teacher_name": "N/A",
    "avatar_url": "https://res.cloudinary.com/dmdxkhocb/image/upload/v1756114883/orqp3uuqpqe94pwm9imv.jpg"
  }
];

// Add qr_url for each student
const dataWithQR = students.map(student => ({
  ...student,
  qr_url: `https://school.com/icard/${student.icard_number}`
}));

// Define CSV fields
const fields = [
  "id",
  "icard_number",
  "student_id",
  "status",
  "name",
  "level",
  "class_name",
  "room",
  "teacher_name",
  "avatar_url",
  "qr_url"
];

// Convert JSON → CSV
const opts = { fields };
const csv = parse(dataWithQR, opts);

// Save to file
fs.writeFileSync("students.csv", csv);

console.log("✅ students.csv has been created!");
