/* eslint no-console: 0 */

import type { ELoggerColors } from './enums';

export default class Logger {
  private static readonly _colors: Record<ELoggerColors, (text: string) => string> = {
    red: (text: string) => `\x1b[31m${text}\x1b[0m`,
    yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
    blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
    magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
    gray: (text: string) => `\x1b[90m${text}\x1b[0m`,
    yellowBright: (text: string) => `\x1b[93m${text}\x1b[0m`,
    bgBlue: (text: string) => `\x1b[44m${text}\x1b[0m`,
  };

  private static _counter: { target: string; start: number }[] = [];

  private static get counter(): { target: string; start: number }[] {
    return Logger._counter;
  }

  private static set counter(val: { target: string; start: number }[]) {
    Logger._counter = val;
  }

  private static get colors(): Record<ELoggerColors, (text: string) => string> {
    return Logger._colors;
  }

  /**
   * Log new log.
   * @param target Log target used as prefix for log.
   * @param {...unknown} messages All messages that you want to log.
   */
  static log(target: string, ...messages: unknown[]): void {
    console.log(Logger.colors.blue(`${Logger.getTime()} Log.log: `), target, ...messages);
  }

  /**
   * Log new debug.
   * This log will not show up, when NODE_ENV is set to production.
   * @param target Log target used as prefix for log.
   * @param {...unknown} messages All messages that you want to log.
   */
  static debug(target: string, ...messages: unknown[]): void {
    console.log(Logger.colors.magenta(`${Logger.getTime()} Log.Debug: `), target, ...messages);
  }

  /**
   * Log new warning.
   * @param target Log target used as prefix for log.
   * @param {...unknown} messages All messages that you want to log.
   */
  static warn(target: string, ...messages: unknown[]): void {
    console.warn(Logger.colors.yellow(`${Logger.getTime()} Log.Warn: `), target, ...messages);
  }

  /**
   * Trace selected data and log related params.
   * @param target Log target used as prefix for log.
   * @param {...unknown} messages All messages that you want to log.
   */
  static trace(target: string, ...messages: unknown[]): void {
    console.trace(Logger.colors.yellowBright(`${Logger.getTime()} Log.Trace: `), target);
    console.log(...messages);
  }

  /**
   * Log new error.
   * @param target Log target used as prefix for log.
   * @param {...unknown} messages All messages that you want to log.
   */
  static error(target: string, ...messages: unknown[]): void {
    console.error(Logger.colors.red(`${Logger.getTime()} Log.Error: `), target, ...messages);
  }

  /**
   * Start counting time.
   * To end time counting, run `log.endtime` with the same target.
   * @param target Log target used as prefix for log.
   * @param {...unknown} messages All messages that you want to log.
   */
  static time(target: string, ...messages: unknown[]): void {
    Logger.counter.push({ target, start: Date.now() });
    console.log(...messages);
  }

  /**
   * End counting time.
   * @param target Log target used as prefix for log.
   * @param {...unknown} messages All messages that you want to log.
   */
  static endTime(target: string, ...messages: unknown[]): void {
    const localTarget = Logger.counter.filter((e) => e.target === target);

    if (localTarget.length === 0) {
      console.log(Logger.colors.bgBlue(`${Logger.getTime()} Log.Time: `), target, 'error', 'Could not find time start');
    } else {
      Logger.counter = Logger.counter.filter(
        (e) => e.target !== localTarget[0]!.target && e.start !== localTarget[0]!.start,
      );
      console.log(
        Logger.colors.bgBlue(`${Logger.getTime()} Log.Time: `),
        target,
        `Time passed: ${((Date.now() - localTarget[0]!.start) / 1000).toFixed(2)}s`,
      );
    }

    messages.forEach((m) => {
      console.log(`${Logger.getTime()} Log.Time: `, target, m);
    });
  }

  /**
   * Return preformatted time.
   */
  private static getTime(): string {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds().toString().length === 1 ? `0${now.getSeconds()}` : now.getSeconds();

    return `[${h}:${m}:${s}]`;
  }
}
