const fs = require('fs');
const os = require('os');

/**
 * home page. Function executed when url param is equal to "/"
 * @param {*} request
 * @param {*} response
*/

const home = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  const html = fs.readFileSync('./src/public/index.html', 'utf-8');
  response.write(html);
  response.end();
};

/**
 * 404 page. Function executed when url is not found in the router
 * @param {*} request
 * @param {*} response
*/

const notFound = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  const html = fs.readFileSync('./src/public/404.html', 'utf-8');
  response.write(html);
  response.end();
};

/**
 * get the books from books.txt in json format
 * Function executed when url param is equal to "/books"
 * @param {*} request
 * @param {*} response
*/

const getBooks = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  const books = fs.readFileSync('./src/public/books.txt', 'utf-8');
  response.write(books);
  response.end();
};

/**
 * post books to books.txt in json format
 * Function executed when url param is equal to "/books"
 * @param {*} request
 * @param {*} response
*/

const postBooks = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  let newBook = '';
  request.on('data', (chunk) => {
    newBook += chunk;
  });
  request.on('end', () => {
    fs.writeFileSync('./src/public/books.txt', `${newBook},\n`, { encoding: 'utf-8', flag: 'a' });
    response.write(newBook);
    response.end();
  });
};

/**
 * delete books from books.txt
 * Function executed when url param is equal to "/books"
 * @param {*} request
 * @param {*} response
*/

const deleteBooks = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  fs.truncateSync('./src/public/books.txt', 0);
  response.write('Books deleted!');
  response.end();
};

/**
 * Displays a file content from an internal directory.
 * Name of file should be passed via query parameter
 * Function executed when url param is equal to "/file-viewer"
 * @param {*} request
 * @param {*} response
*/

const fileViewer = (request, response) => {
  const path = new URL(`${request.headers.host}${request.url}`);
  const param = path.searchParams.get('filename');
  try {
    const file = fs.readFileSync(`./src/public/files/${param}`, 'utf-8');
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write(file);
    response.end();
  } catch (err) {
    notFound(request, response);
  }
};

/**
 * Displays a JSON showing hostname, cpus available, architecture, uptime,userinfo, memory available
 * Function executed when url param is equal to "/server-status"
 * @param {*} request
 * @param {*} response
*/

const serverStatus = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });

  const statusJSON = {
    hostname: os.hostname(),
    cpus: os.cpus(),
    arch: os.arch(),
    uptime: os.uptime(),
    userInfo: os.userInfo(),
    freemem: os.freemem(),
  };

  response.write(JSON.stringify(statusJSON));
  response.end();
};

module.exports = {
  home,
  notFound,
  getBooks,
  postBooks,
  deleteBooks,
  fileViewer,
  serverStatus,
};
