import * as codeMsg from './code_msg';

const router = require('koa-router')();

const { CODE_OK } = codeMsg;

router.post('/connect', async (ctx: any) => {
  ctx.body = {
    ...CODE_OK,
    data: {
      pid: process.pid,
    },
  };
});

export default router;
