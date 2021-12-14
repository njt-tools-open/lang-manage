import * as path from 'path';
import * as Koa from 'koa';
import router from './apis/index';

const cors = require('@koa/cors');

const KoaStatic = require('koa-static');
const logger = require('koa-logger');
const KoaBody = require('koa-body');
const spa = require('koa-spa');

const app = new Koa();

function start(port: number): void {
  app.use(
    cors({
      'Access-Control-Allow-Origin': '*',
    })
  );
  app.use(logger());
  app.use(
    KoaBody({
      multipart: true,
      formidable: {
        maxFileSize: 1000 * 1024 * 1024,
      },
      patchKoa: true,
    })
  );
  const staticPath = path.join(__dirname, '../../../static');
  app.use(KoaStatic(staticPath));
  // app.use(router.routes(), router.allowedMethods());
  app.use(router.routes());
  app.use(
    spa(staticPath, {
      index: 'index.html',
      404: '404.html',
      routeBase: '/',
      // routes,
    })
  );
  app.listen(port, () => {});
}

start(Number(process.argv[2]));
