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
        await sql `DELETE FROM todolist WHERE id = ${id}`;
        return response.status(200).send();
      case 'POST': 
        const newTodo = await sql `INSERT INTO todolist (text, checked) VALUES (${request.body.text}, false)`;
        return response.status(201).json(newTodo);
      case 'PUT':
        const updatedTodo = await sql `UPDATE todolist SET text = ${request.body.text} WHERE id = ${id}`;
        return response.status(200).json(updatedTodo);
        case 'PATCH':
          const { checked } = request.body;
          const patchedTodo = await sql `UPDATE todolist SET checked = ${checked} WHERE id = ${id}`;
          response.setHeader("Cache-Control", "no-store");
          response.setHeader("Pragma", "no-cache");
          return response.status(200).json(patchedTodo);
      default:
        return response.status(405).json({ error: 'Метод не поддерживается' });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Ошибка сервера!!!' });
  }
}
