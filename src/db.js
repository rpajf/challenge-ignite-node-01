import fs from 'fs/promises';
import { readTasksFromCSV } from './csv/readFromCsv.js';
const dataBasePath = new URL('../db.json', import.meta.url);
const importedTasks = readTasksFromCSV();

class Database {
  constructor() {
    this._initDatabase();
    this.#writeQueue = Promise.resolve();
  }

  async _initDatabase() {
    try {
      const data = await fs.readFile(dataBasePath, 'utf8');
      this.#database = JSON.parse(data);
    } catch (error) {
      this.#persist();
    }
  }
  //  _readCSV(){
  //   // const importedTasks =  readTasksFromCSV()
  //   return importedTasks.then(data => console)
  // }
  #database = {};
  #writeQueue;
  // #persist() {
  //   fs.writeFile(dataBasePath, JSON.stringify(this.#database));
  // }
  #persist() {
    //use promisse to write the data from the CSV file
    // asynchronously
    this.#writeQueue = this.#writeQueue
      .then(() => fs.writeFile(dataBasePath, JSON.stringify(this.#database)))
      .catch((error) => console.error('Error writing to database', error));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    //  console.log(this._readCSV())

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }
    return data;
  }

  insert(table, data) {
    if (!this.#database[table]) {
      this.#database[table] = [];
    }
    // importedTasks.then(data => console.log('data from csv', data))
    // importedTasks.then(data => this.#database[table].push(data))

    this.#database[table].push(data);
    this.#persist();
    return data;
  }
  // delete(table, id) {
  //   const rowIndex = this.#database[table]?.findIndex((row) => row.id === 1);
  //   const rowId = this.#database[table]?.find((row) => row.id === id);
  //   // console.log('db filter',this.#database[table].filter(item => {
  //   //   return item.id!== id
  //   console.log(rowIndex)
  //   // }))
  //   // console.log('row index',rowIndex, 'id', id, {rowId})
  //   if (rowIndex > -1) {
  //   const filtered = this.#database[table].filter((item) => {
  //     // console.log(item.id)
  //     if (item.id === id) {
  //       console.log({ item });
  //     }
  //   });
  //   // this.#database[table].splice(rowIndex, 1);
  //   this.#persist();
  //   // }
  // }
  delete(table, id) {
    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);
    console.log(this.#database[table]);
    if (rowIndex > -1) {
      // this.#database[table].filter(item => item.id === rowIndex)
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  edit(table, id, updatedTask) {
    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);
    console.log('asdsad', rowIndex);
    console.log(this.#database[table][rowIndex]);
    console.log('updaated task', updatedTask);
    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        ...updatedTask
      };
      this.#persist();
    }
  }
}

export default Database;
