import React from 'react';
import { Highlight } from './Highlight';

type RenderJsonProps<T> = {
  children?: T;
  asYaml?: boolean;
}

export const RenderJson = <T extends Record<string, unknown>>({ children, asYaml = false }: RenderJsonProps<T>) => {
  if (children === undefined) {
    return <Highlight language="language-yaml">''</Highlight>
  }

  const content = asYaml
    ? JSON.stringify(children, null, 4)
      .replace(/["{[,\}\]]/g, '')
      .replace(/(\s*\n)/g, '\n')
      .replace(/: (.*)/g, ': "$1"')
    : JSON.stringify(children, null, 2);

  return (
    <Highlight language='language-yaml'>{content}</Highlight>
  );
}