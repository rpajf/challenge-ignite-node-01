import assert from 'assert';
import { generate } from 'csv-generate';
import { parse } from 'csv-parse';
import fs from 'node:fs';
import { Readable, Writable, Transform } from 'node:stream';
const dataBasePath = new URL('file.csv', import.meta.url);

const file = fs.createReadStream(dataBasePath);


export const readTasksFromCSV = async() => {
  const parser = file.pipe(parse({
    delimiter: ',',
    columns: true,
    trim: true
  }))
  // Intialise count
  let count = 0;
  // Report start
  // process.stdout.write('start\n');
  // Iterate through each records
  const tasks = []
  for await (const record of parser) {
    // Report current line
    // tasks.push(record)
    process.stdout.write(`${count++} ${tasks.push(record)}`);
    // process.stdout.write(`${count++} ${record.join(',')}\n`);
    // Fake asynchronous operation
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  // Report end
  // process.stdout.write('...done\n');
  assert.strictEqual(tasks.length, 5);
  return tasks
  // Validation

}