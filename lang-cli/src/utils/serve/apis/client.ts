import { readSettingFile } from '../..';
import { findClientById, saveClientById } from '../../client';
import { formatToSaveContent, getProjectLangPackages } from '../utils';
import * as codeMsg from './code_msg';

const router = require('koa-router')();

const { CODE_OK } = codeMsg;

// MARK: settings

router.get('/settings/all_projects', async (ctx: any) => {
  const { clients } = readSettingFile();
  ctx.body = {
    ...CODE_OK,
    data: {
      clients,
    },
  };
});

router.get('/project/detail', async (ctx: any) => {
  const id = Number(ctx.request.query.id);
  const body: Record<string, any> = {
    ...CODE_OK,
    data: {},
  };
  const clientBaseInfo = findClientById(id);
  const clientDetail = getProjectLangPackages(id);

  if (!clientBaseInfo) {
    Object.assign(body, codeMsg.DATA_NOT_EXIST);
  }
  body.data = {
    ...clientBaseInfo,
    ...clientDetail,
  };

  ctx.body = body;
});

router.post('/project/save', async (ctx: any) => {
  const { id, packages, datasource } = ctx.request.body;
  const files = formatToSaveContent(packages, datasource);
  saveClientById(id, files);

  const body: Record<string, any> = {
    ...CODE_OK,
    data: {},
  };

  ctx.body = body;
});

export default router;
