import * as log4js from 'log4js';

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { 
      type: 'file', 
      filename: 'logs/app.log',
      maxLogSize: 10485760, // 10MB
      backups: 3
    }
  },
  categories: {
    default: { 
      appenders: ['console', 'file'], 
      level: 'info'
    }
  }
});

// ロガーの取得
const logger = log4js.getLogger();

// 使用例
logger.info('情報レベルのログメッセージ');
logger.error('エラーレベルのログメッセージ');
logger.debug('デバッグレベルのログメッセージ');