import { readSettingFile } from '../../index';
import * as codeMsg from './code_msg';

const open = require('open');
const router = require('koa-router')();

const { CODE_OK } = codeMsg;

router.post('/stop', async (ctx: any) => {
  ctx.body = {
    ...CODE_OK,
    data: null,
  };
  setTimeout(() => {
    process.exit(0);
  }, 100);
});

router.post('/open', async (ctx: any) => {
  const { port } = readSettingFile();
  await open(`http://127.0.0.1:${port}`);
  ctx.body = {
    ...CODE_OK,
    data: null,
  };
});

export default router;
