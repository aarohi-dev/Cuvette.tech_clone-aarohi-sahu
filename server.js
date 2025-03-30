const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'joblistings', 
    password: 'makingWeb', 
    port: 5432,
});

app.get('/jobs', async (_req, res) => {
  try {
    const { search, location, experience, salary } = _req.query;

    let query = 'SELECT * FROM "availableJobs" WHERE 1=1';
    let values = [];
    let index = 1;

    if (search) {
        query += ` AND (title ILIKE $${index} OR company ILIKE $${index})`;
        values.push(`%${search}%`);
        index++;
    }
    if (location && location !== 'Location') {
        query += ` AND place = $${index}`;
        values.push(location);
        index++;
    }
    if (experience && experience !== 'Experience') {
        query += ` AND experience = $${index}`;
        values.push(experience);
        index++;
    }
    if (salary && salary !== 'Salary Range') {
        const salaryRange = salary.split('-');
        if (salaryRange.length === 2) {
            query += ` AND package BETWEEN $${index} AND $${index + 1}`;
            values.push(parseInt(salaryRange[0]) * 100000);
            values.push(parseInt(salaryRange[1]) * 100000);
            index += 2;
        }
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
} catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
}
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

pool.query('SELECT * FROM "availableJobs"',(err, res)=>{
  if(err){
    console.error("Database query error:",err);
  }
  else{
    console.log("Query Successful:", res.rows);
  }
});