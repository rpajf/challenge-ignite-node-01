import Database from '../db.js';
import { buildRouteParams } from '../utils/index.js';
import { readTasksFromCSV } from '../csv/readFromCsv.js';
import { randomUUID } from 'node:crypto';
const database = new Database();
const importedTasks = readTasksFromCSV();

export const routes = [
  {
    method: 'POST',
    path: buildRouteParams('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      let task = {
        id: 1,
        title,
        description,
        created_at: new Date(),
        completed_at: null,
        updated_at: null,
      };
      if (!title || !description) {
        importedTasks.then((task) =>
          task.forEach((item) => {
            console.log('items', item);
            // database.insert('tasks', {task, title: item.title, description: item.description});
            database.insert('tasks', {
              id: randomUUID(),
              title: item.title,
              description: item.description,
              created_at: new Date(),
              completed_at: null,
              updated_at: null,
            });
          })
        );
        return res.writeHead(201).end(`task created`);
      } else {
        database.insert('tasks', task);
        console.log('created tasks', task);
        return res.writeHead(201).end(`task created`);
      }
    },
  },
  {
    method: 'GET',
    path: buildRouteParams('/tasks'),
    handler: async (req, res) => {
      const tasks = database.select('tasks');

      return await res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'DELETE',
    path: buildRouteParams('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params;
      database.delete('tasks', id);
      return res.writeHead(204).end();
    },
  },
  {
    method: 'PUT',
    path: buildRouteParams('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { completed_at, title, description } = req.body;
      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: 'title or description are required' })
          );
      }
      //  database.edit('tasks', id);
      const updateDate = new Date();
      const tasks = database.edit('tasks', id, {
        title,
        description,
        updated_at: updateDate,
        completed_at: completed_at,
      });
      // const tasks = database.edit('tasks', id);
      return res.writeHead(204).end(JSON.stringify(tasks));
    },
  },
];
