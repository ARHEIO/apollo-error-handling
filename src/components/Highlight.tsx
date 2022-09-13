import React from 'react';
import hljs from 'highlight.js';

type HighlightProps = {
  children: string;
  language?: string;
} & Omit<JSX.IntrinsicElements['pre'], 'children'>;

export const Highlight = ({ children, language = '', className = '', ...props }: HighlightProps) => {
  const result = children.replaceAll(/^(\n|\s)*\n/g, '').split('\n');
  const leadingSpaces = result[0].search(/\S/);

  const content = result.map((line) => line.slice(leadingSpaces)).join('\n');

  return (
    <pre
      className={[language, className].join('')}
      ref={(element) => element && hljs.highlightElement(element)}
      {...props}
    >
      {content}
    </pre>
  );
}