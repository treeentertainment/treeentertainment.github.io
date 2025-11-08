import type { Plugin } from 'unified';

declare module 'remark-attr' {
  const plugin: Plugin<[Record<string, unknown>?]>;
  export default plugin;
}

declare module 'remark-admonitions' {
  const plugin: Plugin<any[]>;
  export default plugin;
}