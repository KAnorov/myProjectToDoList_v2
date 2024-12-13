// import { neon } from '@neondatabase/serverless';

// const sql = neon(process.env.DATABASE_URL);

// export default async function todo(request, response) {
//   const
//     { query } = request,
//     { path } = query,
//     id = path?.[0];
//     const rows = await sql `SELECT * FROM todo;`;
//     response.status(200).json(rows)
    
// }
import { neon } from '@neondatabase/serverless';
const
  sql = neon(process.env.DATABASE_URL);
export default async function todo(request, response) {
  const
    { query, method } = request,
    { path } = query,
    id = path?.[0];

  console.log('<<', method, { id }, request.body);
  switch (method) {
    case 'GET':
      const rows = await sql `SELECT * FROM todo`;
      response.status(200).json(rows);
      return;
    case 'DELETE':
      const result = await sql `DELETE from todo WHERE id=${id}`;
      console.log('result=', result);
      response.status(200).send();
      return;
    case 'POST':
      const result2 = await sql `INSERT INTO todo (text) values(${request.body.text})`;
      console.log('result2=', result2);
      response.status(201).send();
      return;
  }
}
