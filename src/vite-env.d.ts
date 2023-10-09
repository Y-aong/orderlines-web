/// <reference types="vite/client" />
declare module "uuid";
declare module "vue3-json-viewer";
declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const componentOptions: ComponentOptions;
  export default componentOptions;
}
