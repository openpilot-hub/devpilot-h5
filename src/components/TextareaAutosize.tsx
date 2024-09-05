import React from 'react';

interface TextareaAutosizeProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  maxRow: number;
  lineHeight: number;
}

function TextareaAutosize({ maxRow, lineHeight, style, ...rest }: TextareaAutosizeProps, ref: React.ForwardedRef<HTMLTextAreaElement>) {
  const height = Math.min(((rest.value as string) || '').split(/\n/).length, maxRow) * lineHeight;
  return <textarea ref={ref} {...rest} style={{ ...style, boxSizing: 'content-box', height, lineHeight: lineHeight + 'px' }} />;
}

export default React.forwardRef(TextareaAutosize);
