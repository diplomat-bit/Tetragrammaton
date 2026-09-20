export interface LogMeta {
  [key: string]: any;
}

export class Logger {
  private context: string;

  constructor(context: string = 'App') {
    this.context = context;
  }

  public info(message: string | LogMeta, meta?: LogMeta): void {
    const timestamp = new Date().toISOString();
    if (typeof message === 'object') {
      console.log(`[${timestamp}] [INFO] [${this.context}]`, JSON.stringify(message));
    } else {
      console.log(`[${timestamp}] [INFO] [${this.context}] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  }

  public warn(message: string | LogMeta, meta?: LogMeta): void {
    const timestamp = new Date().toISOString();
    if (typeof message === 'object') {
      console.warn(`[${timestamp}] [WARN] [${this.context}]`, JSON.stringify(message));
    } else {
      console.warn(`[${timestamp}] [WARN] [${this.context}] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  }

  public error(message: string | LogMeta, meta?: LogMeta): void {
    const timestamp = new Date().toISOString();
    if (typeof message === 'object') {
      console.error(`[${timestamp}] [ERROR] [${this.context}]`, JSON.stringify(message));
    } else {
      console.error(`[${timestamp}] [ERROR] [${this.context}] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  }

  public debug(message: string | LogMeta, meta?: LogMeta): void {
    const timestamp = new Date().toISOString();
    if (typeof message === 'object') {
      console.debug(`[${timestamp}] [DEBUG] [${this.context}]`, JSON.stringify(message));
    } else {
      console.debug(`[${timestamp}] [DEBUG] [${this.context}] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  }
}

export const logger = new Logger('VisaSystem');
export default logger;
