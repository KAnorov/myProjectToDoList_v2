import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function todo(request, response) {
  const { query, method } = request;
  const { path } = query;
  const id = path?.[0];

  try {
    switch (method) {
      case 'GET':
        const rows = await sql`SELECT * FROM todolist`;
        response.status(200).json(rows);
        return;

      case 'DELETE':
        await sql`DELETE FROM todolist WHERE id = ${id}`;
        response.status(200).send();
        return;

      case 'POST':
        await sql`INSERT INTO todolist (text, checked) VALUES (${request.body.text}, false)`;
        response.status(201).send();
        return;

      case 'PUT':
        if (!id) {
          return response.status(400).json({ error: 'ID задания не указан для обновления' });
        }
        await sql`UPDATE todolist SET text = ${request.body.text} WHERE id = ${id}`;
        response.status(200).send();
        return;
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    response.status(500).json({ error: 'Ошибка сервера!!!' });
  }
}
