import { sendToPlugin } from '@/services/pluginBridge';
import { CodeReference, PluginCommand } from '@/typings';
import { AiOutlineClose, AiOutlineCopyrightCircle } from 'react-icons/ai';
import { useTheme } from 'styled-components';
import './index.less';

interface FileReferenceProps {
  codeRef: CodeReference;
  onRemove(): void;
}

export default function FileReference({ codeRef, onRemove }: FileReferenceProps) {
  const theme = useTheme();

  return (
    <div className="file-reference-holder" style={{ backgroundColor: theme.inputFieldBG }}>
      <div
        className="file-reference"
        onClick={() => sendToPlugin(PluginCommand.GotoSelectedCode, codeRef)}
        style={{ backgroundColor: theme.inputFieldBG }}
      >
        <AiOutlineCopyrightCircle style={{ marginRight: 4, color: theme.primary }} />
        <div style={{ color: theme.text }}>{codeRef.fileName}</div>
        <AiOutlineClose
          style={{ marginLeft: 4, cursor: 'pointer', fontSize: 10, color: '#999' }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      </div>
    </div>
  );
}
