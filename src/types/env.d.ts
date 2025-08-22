declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_DB_CONNECTION_STRING: string;
    PORT: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
