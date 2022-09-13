export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_BOT_CHAT_ID: string;
      TELEGRAM_BOT_TOKEN: string;
      VERCEL_DEPLOY_HOOK: string;
    }
  }
}
