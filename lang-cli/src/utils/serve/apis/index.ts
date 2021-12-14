import commands from './commands';
import client from './client';
import test from './test';

const Router = require('koa-router');

const router = new Router({ prefix: '/api' });

router.use('/test', test.routes(), test.allowedMethods());
router.use('/client', client.routes(), client.allowedMethods());
router.use('/commands', commands.routes(), commands.allowedMethods());

export default router;
