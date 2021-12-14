import { stopServer } from '../../apis';

const stop = (..._args: any[]): void => {
  stopServer();
};

export default stop;
