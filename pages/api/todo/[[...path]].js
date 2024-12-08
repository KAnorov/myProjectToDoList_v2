import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
// const  rows  = await sql `SELECT * FROM todo`;


export default async function (req, res) {
  const { path } = req.query;
  const id = path?.[0];

  console.log("****", { id });
  const rows = await sql `SELECT * FROM todo`;
  res.status(200).json(rows);

}