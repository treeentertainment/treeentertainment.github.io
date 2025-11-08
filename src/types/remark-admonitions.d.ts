declare module 'remark-admonitions' {
  import type { Plugin } from 'unified';

  // Minimal options shape; adjust if needed
  interface RemarkAdmonitionsOptions {
    customTypes?: string[];
    tag?: string;
    icons?: 'none' | 'ascii' | 'unicode';
  }

  const remarkAdmonitions: Plugin<[RemarkAdmonitionsOptions?]>;
  export default remarkAdmonitions;
}