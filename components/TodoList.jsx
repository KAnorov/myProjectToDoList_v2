import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export default async function todo(request, response) {
  const { method } = request;
  console.log('<<', method, request.body);

  try {
    switch (method) {
      case 'GET':
        const rows = await sql `SELECT * FROM todo;`;
        response.status(200).json(rows);
        break;

      case 'DELETE':
        const { path } = request.query;
        const id = path?.[0];

        if (!id) {
          return response.status(400).json({ error: 'ID is required for deletion' });
        }

        const deleteResult = await sql `DELETE FROM todo WHERE id=${id} RETURNING *;`;
        if (deleteResult.count === 0) {
          return response.status(404).json({ error: 'Todo not found' });
        }
        
        console.log('Deleted item:', deleteResult);
        response.status(200).json({ message: 'Todo deleted successfully' });
        break;

      case 'POST':
        if (!request.body.text) {
          return response.status(400).json({ error: 'text is required' });
        }
        
        const result2 = await sql `INSERT INTO todo (text) VALUES (${request.body.text}) RETURNING *;`;
        console.log('Added item:', result2);
        
        response.status(201).json(result2);
        break;

      // default:
      //   response.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      //   response.status(405).end(`Method ${method} Not Allowed`);
      //   break;
    }
  } catch (error) {
    console.error('Database query error:', error.message);
    response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
