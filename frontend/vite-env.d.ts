/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_BASE_URL_LOCAL: string;
    VITE_BASE_URL_PROD: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  