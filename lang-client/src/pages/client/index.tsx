import {
  createSignal,
  For,
  JSXElement,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { useNavigate, useParams } from 'solid-app-router';
import classnames from 'classnames';
import { useI18n } from 'solid-i18n';
import { reqGetProjectById, reqSaveProjectById } from '../../apis';
import Completion from './completion';
import ModifyItem from './modify-item';

import styles from './index.module.css';
import LayoutScroll, {
  LayoutHeaderCenter,
} from '../../components/layout-scroll';
import Tooltip from '../../components/tooltip';
import notification from '../../utils/notification';
import ModalAdd from './modal-add';

interface CmpSwitchOption {
  value: string;
  label: string;
}

interface PropsCmpSwitch {
  active: () => string;
  options: CmpSwitchOption[];
  onChange: (value: string) => void;
}

enum TooltipActions {
  PLUS = 'plus',
  SAVE = 'save',
  HOME = 'home',
  DELETE = 'delete',
  TOP = 'top',
}

const actions = [
  {
    key: TooltipActions.PLUS,
    icon: TooltipActions.PLUS,
  },
  {
    key: TooltipActions.DELETE,
    icon: TooltipActions.DELETE,
  },
  // {
  //   key: TooltipActions.SAVE,
  //   icon: TooltipActions.SAVE,
  // },
  {
    key: TooltipActions.HOME,
    icon: TooltipActions.HOME,
  },
  {
    key: TooltipActions.TOP,
    icon: TooltipActions.TOP,
  },
];

const modifyViewHideActions: TooltipActions[] = [
  TooltipActions.DELETE,
  TooltipActions.PLUS,
  TooltipActions.SAVE,
];

function CmpSwitch({ active, options, onChange }: PropsCmpSwitch): JSXElement {
  const i18n = useI18n();
  return (
    <div
      class={classnames(
        'wlc-flex',
        'text-3xl',
        'wlc-border-2',
        'wlc-border-white',
        'wlc-bg-white',
        'wlc-rounded',
        'wlc-shadow-lg'
      )}
    >
      {options.map(item => (
        <div
          class={classnames(
            'wlc-flex-grow',
            'wlc-py-2',
            'wlc-px-8',
            'wlc-rounded-sm',
            'wlc-hover:bg-purple-700',
            'wlc-rounded',
            item.value === active()
              ? 'wlc-cursor-default'
              : 'wlc-cursor-pointer',
            item.value === active() ? 'wlc-bg-gray-800' : 'wlc-bg-white',
            item.value === active() ? 'wlc-text-white' : 'wlc-text-gray-800'
          )}
          onClick={() => onChange(item.value)}
        >
          {i18n.t(item.label)}
        </div>
      ))}
    </div>
  );
}

enum PAAGE_VIEW {
  OVERVIEW = 'overview',
  MODIFY = 'modify',
}

interface StateModel {
  deleteSelectedKeys: string[];
}

const defaultFormAdd = () => ({ name: '', data: {} });

function PageClient(): JSXElement {
  const navigate = useNavigate();
  /** 统一状态存储 */
  const [state, setState] = createStore<StateModel>({ deleteSelectedKeys: [] });
  /** 新增表单数据 */
  const [formAdd, setFormAdd] = createStore<DatasourceModel>(defaultFormAdd());
  /** 显示新增表单 */
  const [getFormAddVisible, setFormAddVisible] = createSignal<boolean>(false);
  /** 视图: 概览|修改 */
  const [getView, setView] = createSignal<string>(PAAGE_VIEW.OVERVIEW);
  /** 根据不同视图选择隐藏图标 */
  const [getHideActions, setHideActions] = createSignal<TooltipActions[]>(
    modifyViewHideActions
  );
  /** 进入删除状态 */
  const [getDeleteStatus, setDeleteStatus] = createSignal<boolean>(false);
  /** 当前项目语言包数据 */
  const [projectInfo, setProjectInfo] = createStore<ProjectInfoModel>({
    name: '',
    id: -1,
    dir: '',
    packages: [],
    datasource: [],
  });
  const params = useParams();
  let scrollRef: HTMLDivElement | undefined;

  async function getProject() {
    const { code, data } = await reqGetProjectById(Number(params.id));

    if (code === 0) {
      setProjectInfo(data);
    }
  }

  async function handleSave() {
    const { id, packages, datasource } = projectInfo;
    try {
      const res = await reqSaveProjectById(id, packages, datasource);
      if (res.code === 0) {
        notification('保存成功', { lang: 'zh-CN', body: '' });
      } else {
        notification('保存失败', { lang: 'zh-CN', body: '' });
      }
      getProject();
    } catch (error) {
      notification('保存失败', { lang: 'zh-CN', body: '' });
    }
  }

  function handleSwitchView(value: string) {
    let hideKeys: TooltipActions[] = [];
    switch (value) {
      case PAAGE_VIEW.OVERVIEW:
        hideKeys = modifyViewHideActions;
        break;
      default:
        break;
    }
    setHideActions(hideKeys);
    setView(value);
  }

  function handleUpdateDatasource(name: string, value: DatasourceModel) {
    setProjectInfo('datasource', data => {
      const index = data.findIndex(item => item.name === name);
      Object.assign(data[index], value);
      return data;
    });
  }

  function handleToolipAction(key: string) {
    switch (key) {
      case TooltipActions.HOME:
        navigate('/');
        break;
      case TooltipActions.PLUS:
        setFormAddVisible(true);
        break;
      case TooltipActions.DELETE:
        setDeleteStatus(!getDeleteStatus());
        break;
      case TooltipActions.SAVE:
        handleSave();
        break;
      case TooltipActions.TOP:
        scrollRef?.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        break;
      default:
    }
  }

  function handleDeleteSelect(key: string) {
    const keys = [...state.deleteSelectedKeys];
    const index = keys.indexOf(key);
    if (index === -1) {
      keys.push(key);
    } else {
      keys.splice(index, 1);
    }
    setState({ deleteSelectedKeys: keys });
  }

  function handleDeleteExec() {
    const { datasource } = projectInfo;

    const newDatasource = [
      ...datasource.filter(
        ({ name }) => !state.deleteSelectedKeys.includes(name)
      ),
    ];

    setDeleteStatus(false);
    setState({ deleteSelectedKeys: [] });
    setProjectInfo({ datasource: newDatasource });
  }

  // TODO: 后续处理 windows
  function handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Backspace':
        handleDeleteExec();
        break;
      case 'Escape':
        setFormAddVisible(false);
        break;
      case 's':
        if (e.metaKey) {
          e.preventDefault();
          handleSave();
        }
        break;
      default:
    }
  }

  /** 新增翻译 key */
  function handleChangeFormAddName(e: InputEvent) {
    setFormAdd({ name: e.target?.value });
  }
  /** 新增翻译 value */
  function handleChangeFormAddField(key: string, e: InputEvent) {
    setFormAdd('data', data => Object.assign(data, { [key]: e.target?.value }));
  }

  /** 新增保存 */
  function handleAddSave() {
    const { name: formAddName } = formAdd;

    if (projectInfo.datasource.find(item => item.name === formAddName)) {
      notification(`"${formAddName}" 已存在`);
      return;
    }
    setProjectInfo('datasource', data => {
      const langs: Record<string, string> = {};
      projectInfo.packages.forEach(({ name }) => {
        langs[name] = formAdd.data[name] || '';
      });
      const newData = [
        ...data,
        {
          name: formAddName,
          data: langs,
        },
      ];
      return newData;
    });
    handleSave();
    setFormAddVisible(false);
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    getProject();
  });

  onCleanup(() => {
    window.removeEventListener('keydown', handleKeydown);
  });

  return (
    <LayoutScroll
      ref={scrollRef}
      renderHeader={() => (
        <LayoutHeaderCenter
          render={() => (
            <CmpSwitch
              active={getView}
              options={[
                { label: 'CLIENT.OVERVIEW', value: PAAGE_VIEW.OVERVIEW },
                { label: 'CLIENT.MODIFY', value: PAAGE_VIEW.MODIFY },
              ]}
              onChange={handleSwitchView}
            />
          )}
        />
      )}
      renderBody={() => (
        <>
          <Switch>
            <Match when={getView() === PAAGE_VIEW.OVERVIEW}>
              <Show when={projectInfo.packages.length}>
                <Completion packages={projectInfo.packages} />
              </Show>
            </Match>
            <Match when={getView() === PAAGE_VIEW.MODIFY}>
              <div class={styles['section-inner']}>
                <For each={projectInfo.datasource}>
                  {item => (
                    <ModifyItem
                      deleting={getDeleteStatus}
                      state={state}
                      packages={projectInfo.packages}
                      translation={item}
                      onUpdate={val => handleUpdateDatasource(item.name, val)}
                      onSelect={key => handleDeleteSelect(key)}
                    />
                  )}
                </For>
              </div>
            </Match>
          </Switch>
          <Tooltip
            options={actions}
            hideKeys={getHideActions}
            onSelect={handleToolipAction}
          />
          <Show when={getFormAddVisible()}>
            <ModalAdd>
              <div class="wlc-flex wlc-justify-center wlc-items-center wlc-h-24 wlc-px-8 wlc-border-b-2 wlc-mb-2">
                <input
                  type="text"
                  placeholder="key"
                  class={classnames(
                    'wlc-h-10',
                    'wlc-w-full',
                    'wlc-px-2',
                    'wlc-border',
                    'wlc-rounded',
                    'focus:wlc-border-blue-500',
                    'wlc-border-gray-200'
                  )}
                  onInput={handleChangeFormAddName}
                />
              </div>
              <For each={projectInfo.packages}>
                {({ name }) => (
                  <div
                    class="wlc-relative wlc-flex wlc-items-center wlc-mx-10"
                    style={{ height: '56px', 'padding-left': '160px' }}
                  >
                    <span
                      title={name}
                      class={classnames(
                        'wlc-absolute',
                        'wlc-truncate',
                        'wlc-h-full'
                      )}
                      style={{
                        top: 0,
                        left: 0,
                        width: '150px',
                        height: '56px',
                        'line-height': '56px',
                      }}
                    >
                      {name}
                    </span>
                    <input
                      type="text"
                      class={classnames(
                        'wlc-h-10',
                        'wlc-w-full',
                        'wlc-px-2',
                        'wlc-border',
                        'wlc-rounded',
                        'focus:wlc-border-blue-500',
                        'wlc-border-gray-200'
                      )}
                      onInput={e => handleChangeFormAddField(name, e)}
                    />
                  </div>
                )}
              </For>
              <div class="wlc-flex wlc-justify-center wlc-items-center">
                <button
                  class={classnames(
                    'wlc-py-2',
                    'wlc-px-8',
                    'wlc-border',
                    'wlc-border-gray-800',
                    'wlc-mt-2',
                    'wlc-mr-6',
                    'wlc-bg-white',
                    'wlc-text-gray-800',
                    'wlc-rounded',
                    'wlc-cursor-pointer'
                  )}
                  onClick={() => setFormAddVisible(false)}
                >
                  取 消
                </button>
                <button
                  class={classnames(
                    'wlc-py-2',
                    'wlc-px-8',
                    'wlc-border',
                    'wlc-border-gray-800',
                    'wlc-mt-2',
                    'wlc-bg-gray-800',
                    'wlc-text-white',
                    'wlc-rounded',
                    'wlc-cursor-pointer'
                  )}
                  onClick={handleAddSave}
                >
                  提 交
                </button>
              </div>
            </ModalAdd>
          </Show>
        </>
      )}
    />
  );
}

export default PageClient;
