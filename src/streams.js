import http from 'node:http';
import { Readable, Writable, Transform } from 'node:stream';
process.stdin.pipe(process.stdout);
import { createCSV } from './streams/cvParse';
class OneToHundredStream extends Readable {

  index = 1;

  _read() {
    const i = this.index++;
    setTimeout(() => {
      if (i > 100) {
        this.push(null);
      } else {
        let buf = Buffer.from(i.toString());

        this.push(buf);
      }
    }, 1000);
  }
}
class Inverse extends Transform{
  _transform( chunk, encoding, callback){
    const transformed = Number(chunk.toString()) * -1

    callback(null, Buffer.from(transformed.toString()))

  }
}
class MultiplyByTenStream extends Writable{
  _write(chunk, encoding, callback){
    console.log(Number(chunk.toString() * 10))
    callback()

  }

}


new OneToHundredStream().pipe(
  new Inverse()
).pipe(new MultiplyByTenStream())