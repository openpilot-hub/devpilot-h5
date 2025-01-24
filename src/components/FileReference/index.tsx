import { sendToPlugin } from '@/services/pluginBridge';
import { CodeReference, PluginCommand } from '@/typings';
import { AiOutlineClose, AiOutlineCopyrightCircle } from 'react-icons/ai';
import './index.less';

interface FileReferenceProps {
  codeRefs: CodeReference[];
  onRemove(index: number): void;
  onChange(e: CodeReference[]): void;
}

export default function FileReference({ codeRefs, onRemove, onChange }: FileReferenceProps) {
  return (
    <div className="file-reference-container">
      {codeRefs.map((codeRef, index) => {
        return (
          <div
            className="file-reference"
            title={codeRef.fileUrl}
            onClick={() => {
              sendToPlugin(PluginCommand.GotoSelectedCode, codeRef);
              codeRef.order = codeRefs.reduce((ret, next) => Math.max(ret, next.order || 0), 0) + 1;
              onChange([...codeRefs]);
            }}
          >
            <AiOutlineCopyrightCircle style={{ marginRight: 4, color: 'var(--primaryColor)' }} />
            <div style={{ color: 'var(--text)' }}>{codeRef.fileName}</div>
            <AiOutlineClose
              style={{ marginLeft: 4, cursor: 'pointer', fontSize: 10, color: '#999' }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
