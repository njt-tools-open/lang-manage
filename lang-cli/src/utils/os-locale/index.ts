import * as lcid from 'lcid';
import { execSync } from './exec';

const defaultOptions = { spawn: true };
const defaultLocale = 'en-US';

export interface Options {
  /**
	Set to `false` to avoid spawning subprocesses and instead only resolve the locale from environment variables.

	@default true
	*/
  readonly spawn?: boolean;
}

function getStdOutSync(command: string, args: string[] = []) {
  return execSync(command, args);
}

function getEnvLocale(env = process.env) {
  return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
}

function parseLocale(context: string) {
  const env: Record<string, string> = {};
  for (const definition of context.split('\n')) {
    const [key, value] = definition.split('=');
    env[key] = value.replace(/^"|"$/g, '');
  }

  return getEnvLocale(env);
}

function getLocale(context = '') {
  return context.replace(/[.:].*/, '');
}

function getLocalesSync() {
  return getStdOutSync('locale', ['-a']);
}

function getSupportedLocale(locale: string, locales = '') {
  return locales.includes(locale) ? locale : defaultLocale;
}

function getAppleLocaleSync() {
  return getSupportedLocale(
    getStdOutSync('defaults', ['read', '-globalDomain', 'AppleLocale']),
    getLocalesSync()
  );
}

function getUnixLocaleSync() {
  return getLocale(parseLocale(getStdOutSync('locale')));
}

function getWinLocaleSync() {
  const stdout = getStdOutSync('wmic', ['os', 'get', 'locale']);
  const lcidCode = Number.parseInt(stdout.replace('Locale', ''), 16);

  return lcid.from(lcidCode);
}

function normalise(input: string) {
  return input.replace(/_/, '-');
}

const cache = new Map();

export function osLocaleSync(options = defaultOptions): string {
  if (cache.has(options.spawn)) {
    return cache.get(options.spawn);
  }

  let locale;
  try {
    const envLocale = getEnvLocale();

    if (envLocale || options.spawn === false) {
      locale = getLocale(envLocale);
    } else if (process.platform === 'win32') {
      locale = getWinLocaleSync();
    } else if (process.platform === 'darwin') {
      locale = getAppleLocaleSync();
    } else {
      locale = getUnixLocaleSync();
    }
    // eslint-disable-next-line no-empty
  } catch {}

  const normalised = normalise(locale || defaultLocale);
  cache.set(options.spawn, normalised);
  return normalised;
}
