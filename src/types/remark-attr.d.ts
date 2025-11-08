declare module 'remark-attr' {
  import type { Plugin } from 'unified';
  const plugin: Plugin<[Record<string, unknown>?]>;
  export default plugin;
}