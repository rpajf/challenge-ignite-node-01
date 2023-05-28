
export const buildRouteParams = (path) =>{
  const routeParamsRegex = /:([a-zA-Z]+)/g;

  const pathWithParams = path.replace(routeParamsRegex, '(?<$1>[a-z0-9-_]+)');
  
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  return pathRegex;
}


export const getQueryParams= (query) =>{
  return query?.substr(1).split('&').reduce((queryParams, param) => {
    const [key, value] = param.split('=')
    queryParams[key] = value
    return queryParams
  },{})
}
