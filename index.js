const http = require('http');
const handler = require('./src/handlers');

const PORT = 8087;

const myRouter = (path) => {
  const routes = {
    '/': handler.home,
    '/books': {
      getBooks: handler.getBooks,
      postBooks: handler.postBooks,
      deleteBooks: handler.deleteBooks,
    },
    '/file-viewer': handler.fileViewer,
    '/server-status': handler.serverStatus,
  };

  if (routes[path]) {
    return routes[path];
  }

  return handler.notFound;
};

const server = http.createServer((request, response) => {
  const path = new URL(`${request.headers.host}${request.url}`);

  const url = path.pathname.match(/\/\S*/g);

  const route = myRouter(url);

  if (request.url === '/books') {
    switch (request.method) {
      case 'GET':
        route.getBooks(request, response);
        break;
      case 'POST':
        route.postBooks(request, response);
        break;
      case 'DELETE':
        route.deleteBooks(request, response);
        break;
      default:
        break;
    }
  } else {
    route(request, response);
  }
});

server.listen(PORT, () => {
  process.stdout.write('Server is running!\n');
});
