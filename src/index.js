// Description: This code sets up a basic Express server with Supabase integration, allowing for CORS and environment variable management.
// It uses the Supabase client to connect to a database and handle requests.
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { v4: uuidv4 } = require("uuid");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');


// Middleware setup
app.use(express.json());
app.use(cors());





// supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // use service role for admin actions
const supabase = createClient(supabaseUrl, supabaseKey);



// users management
app.post("/users/createusers", async (req, res) => {
  try {
    const { fullName, role, phone, email, school_id } = req.body;
    const password = "00000000";

    // 1️⃣ Check if the user already exists in Auth
    const { data: existingUser, error: getUserError } = await supabase.auth.admin.listUsers();
    if (getUserError) throw getUserError;

    let user_id;
    const found = existingUser.users.find((u) => u.email === email);
    if (found) {
      user_id = found.id;
    } else {
      // Create a new user in Auth
      const { data: userData, error: userError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          user_metadata: { fullName, phone, role },
          email_confirm: true, // mark as confirmed
        });

      if (userError) throw userError;
      user_id = userData.user.id;
    }

    // 2️⃣ Check if user already exists in user_schools for this school
    const { data: existingRow, error: existingError } = await supabase
      .from("user_schools")
      .select("*")
      .eq("user_id", user_id)
      .eq("school_id", school_id)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existingRow) {
      return res.status(200).json({
        data: existingRow,
        alreadyExists: true,
        message: "User already linked to this school.",
      });
    }

    // 3️⃣ Insert into user_schools
    const newRow = {
      id: uuidv4(),
      user_id,
      school_id,
      role,
      name: fullName,
      phone,
      email,
      password: "not set",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: userSchool, error: userSchoolError } = await supabase
      .from("user_schools")
      .insert(newRow)
      .select()
      .single();
    if (userSchoolError) throw userSchoolError;
    return res.status(200).json({
      data: userSchool,
      alreadyExists: false,
      message: "User created and linked to school.",
    });
  } catch (err) {
    console.error("Error in /users/createusers:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});


app.get('/students_users/:schoolId',async (req,res)=>{
 const {schoolId}=req.params;
 console.log(schoolId)
  // fetch users from user_schools
  const { data: users, error: usersError } = await supabase
    .from("user_schools")
    .select("id, user_id, role, school_id,name,phone,email") // add more fields if exist
    .eq("school_id", schoolId);

  if (usersError){
    res.status(500).json({message:'oops error !'});
  };

  // fetch students
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, name, class, phone, school_id,parent_id") // adjust columns
    .eq("school_id", schoolId);
    if (studentsError){
    res.status(500).json({message:'oops error !'});
  };
  console.log(students);
  console.log(users);

  
  res.json({ users, students });
})  
app.listen(port,()=>{
  console.log('app listening on :',port)
})



































//app listen
app.listen(port,()=>{
    console.log('app listening on :',port)
})



