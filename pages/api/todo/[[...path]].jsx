import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function todo(request, response) {
  const { query, method } = request;
  const { path } = query;
  const id = path?.[0];

  try {
    switch (method) {
      case 'GET':
        return response.status(200).json(await sql `SELECT * FROM todolist`);
      case 'DELETE':
        return response.status(200).send(await sql `DELETE FROM todolist WHERE id = ${id}`);;
      case 'POST':
        return response.status(201).json(await sql `INSERT INTO todolist (text, checked) VALUES (${request.body.text}, false)`);
      case 'PUT':
        return response.status(200).json(await sql `UPDATE todolist SET text = ${request.body.text} WHERE id = ${id}`);
        case 'PATCH':
        const checked= await response.status(200).json()
        console.log('PATCH=', {checked})
          return 
    }
  } catch (error) {
    response.status(500).json({ error: 'Ошибка сервера!!!' });
  }
}