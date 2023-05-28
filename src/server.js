import http from 'node:http';
import { json } from './middlewares/json.js';
import { randomUUID } from 'node:crypto';
import { buildRouteParams, getQueryParams } from './utils/index.js';
import { routes } from './routes/index.js';


const server = http.createServer(async (req, res) => {

  const { method, url } = req;

  
  await json(req, res);
  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });
  if(route){
    const routeParams = req.url.match(route.path);
    const { query, ...params } = routeParams.groups;
    // console.log('queryget', getQueryParams(query), {query})
    // console.log('query params', getQueryParams(query))

    // req.params = routeParams.groups
    req.params = params;
    //return empty object if query is null
    req.query = query ? getQueryParams(query) : {};
    return route.handler(req,res)
  }
  
  return res.writeHead(404).end();
})

server.listen(3333)