import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
// import { visit } from 'unist-util-visit';
import { memo } from 'react';
import type { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import MarkdownComponents from './CodeEditor';

// function rehypeInlineCodeProperty() {
//   return function (tree: any) {
//     visit(
//       tree,
//       (node: any) => node.tagName === 'code',
//       function (node, index, parent) {
//         if (parent && parent.tagName === 'pre') {
//           node.properties.inline = 'false';
//         } else {
//           node.properties.inline = 'true';
//         }
//       },
//     );
//   };
// }

function Markdown(props: ReactMarkdownOptions) {
  return (
    <ReactMarkdown {...props} className="markdown-renderer" components={MarkdownComponents} rehypePlugins={[rehypeRaw]}></ReactMarkdown>
  );
}

export default memo(Markdown);
