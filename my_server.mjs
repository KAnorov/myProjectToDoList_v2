import { DatabaseSync } from 'node:sqlite';
import { createServer } from 'node:http';
import { parse as parsePath } from 'node:path';

const database = new DatabaseSync('./todo.sqlite');
database.exec(`
  CREATE TABLE IF NOT EXISTS todo (
    id INTEGER PRIMARY KEY,
    title TEXT,
    completed INTEGER DEFAULT 0
  )
`);

const port = 3333;

const readBody = (req) => {                      // Функция для чтения JSON из тела запроса
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

const server = createServer(async (req, res) => {
  const { method, url } = req;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === 'GET' && url === '/todo') {
    const getAllSt = database.prepare(`SELECT * FROM todo`);
    const todos = getAllSt.all();
    res.writeHead(200);
    res.end(JSON.stringify(todos));
  } 
  else if (method === 'POST' && url === '/todo') {
    try {
      const { title } = await readBody(req);
      const addSt = database.prepare(`INSERT INTO todo (title) VALUES (?)`);
      const info = addSt.run(title);
      res.writeHead(201);
      res.end(JSON.stringify({ id: info.lastInsertRowid, title, completed: 0 }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Ошибка при добавлении задания' }));
    }
  } 
  else if (method === 'DELETE' && url.startsWith('/todo/')) {
    const id = parsePath(url).base;
    const deleteSt = database.prepare(`DELETE FROM todo WHERE id = ?`);
    deleteSt.run(id);
    res.writeHead(204);
    res.end();
  } 
  else if (method === 'PATCH' && url.startsWith('/todo/')) {
    const id = parsePath(url).base;
    try {
      const body = await readBody(req);
      const { completed } = body;
      const updateSt = database.prepare(`UPDATE todo SET completed = ? WHERE id = ?`);
      updateSt.run(completed ? 1 : 0, id);
      res.writeHead(200);
      res.end();
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Ошибка при обновлении задания' }));
    }
  }
  else if (method === 'PUT' && url.startsWith('/todo/')) {
    const id = parsePath(url).base; 
    try {
      const body = await readBody(req);
      const { title, completed } = body; 
      const updateSt = database.prepare(`UPDATE todo SET title = ?, completed = ? WHERE id = ?`);
      updateSt.run(title, completed ? 1 : 0, id);
      res.writeHead(200);
      res.end(JSON.stringify({ id, title, completed: completed ? 1 : 0 }));
    } catch (error) {
      res.writeHead(400);

      res.end(JSON.stringify({ error: 'Ошибка при обновлении задания' }));
    }
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
