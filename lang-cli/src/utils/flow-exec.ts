import { isPromise, isFunction } from './index';
import tip from './tip';

export interface EvoData {
  state: Record<string, any>;
  param: null | Record<string, any>;
}

export class FlowExec {
  isPending = false;

  tasks: any[] = [];

  state: Record<string, any> = {};

  constructor(state: Record<string, any>) {
    this.state = state;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  exec = (fn: any): FlowExec => {
    if (this.isPending) {
      this.tasks.push(fn);
    } else {
      this.do(fn, { state: this.state, param: null });
    }
    return this;
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  next = (option: any) => {
    if (this.tasks.length) {
      this.do(this.tasks.shift(), { state: this.state, param: option });
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  do = (fn: any, option: any) => {
    const next = fn(option);
    if (isFunction(next)) {
      const nextOption = next();
      this.next(nextOption);
      return;
    }
    if (isPromise(next)) {
      this.isPending = true;
      next
        .then((res: any) => {
          this.isPending = false;
          this.next(res);
        })
        .catch((error: Error) => {
          this.isPending = false;
          tip.error('flow error with promise.');
          tip.error(error);
        });
      return;
    }
    if (next === 0) {
      this.next({});
    }
    if (next !== 0) {
      tip.info(
        `Task type error, now use ${Object.prototype.toString.call(next)}`
      );
    }
  };
}

export function flowsCompose(state: Record<string, any>): FlowExec {
  return new FlowExec(state);
}
