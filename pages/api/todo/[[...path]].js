import { neon } from '@neondatabase/serverless';
const
  sql = neon(process.env.POSTGRES_URL);
  

  export default async function todo(request, response) {
    const
      { query } = request,
      { path } = query,
      id = path?.[0];

        const rows = await sql `SELECT * FROM todo`;
        response.status(200).json(rows);
    console.log('id=', id)
        return;
    }
  