import pool  from "../lib/db.js";



export const getStudent =  async (req, res) => {
    try {
        const client = await pool.connect()
        const result =  await client.query("SELECT * FROM student")

        res.json(result.rows)
        client.release();

    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: "Server error" });        
    }
}


