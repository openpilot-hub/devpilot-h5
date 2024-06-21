import { useI18n } from "@/i18n";
import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";
import styled from "styled-components";
import { FaFile } from "react-icons/fa6";

const Container = styled.div`
  padding: 0px;
  border-radius: 6px;
  font-family: 'consolas', 'monospace';
  overflow: hidden;
  background-color: ${props => props.theme.ragFileListBG};
  .rag-files-title {
    font-weight: bold;
    user-select: none;
    background-color: ${props => props.theme.ragFileListTitleBG};
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    align-middle: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 3px;
    padding-left: 3px;
    cursor: pointer;
    .file-count {
      font-weight: 400;
      color: ${props => props.theme.textFaint}
    }
  }
  .rag-files-content {
    padding: 5px 0;
    padding-top: 0;
  }
  .rag-files-item {
    padding: 0px 5px;
    margin: 0px 5px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 2px;
    .file-icon {
      flex-shrink: 0;
    }
    .file-name {
      flex-shrink: 1; 
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    color: ${props => props.theme.ragFileListItemFG};
    &:hover {
      color: ${props => props.theme.ragFileListItemHoverFG};
    }
  }
`

export default function RAGFileList({ files, clickAction }: { files: string[], clickAction: (file: string) => void }) {
  const { text } = useI18n();
  const [expaned, setExpanded] = useState(false);
  return (
    <Container>
      <div className="rag-files-title" onClick={() => setExpanded(!expaned)}>
        { expaned ? <IoChevronDown />: <IoChevronForward />}
        <span>{text.ragFileListTitle}</span> <span className="file-count">{text.ragFileListTitleFileCount.replace('%n', ''+files.length)}</span>
      </div>
      {expaned &&
        <div className="rag-files-content">{
          files.map((file: any, i: number) => {
            return (
              <div
                className="rag-files-item"
                data-tooltip-id="tooltip"
                data-tooltip-content={file}
                key={i}
                onClick={() => {
                clickAction(file);
                }}
              >
                <FaFile className="file-icon"/> <span className="file-name">{file}</span>
              </div>
            )
          })
        }
        </div>
      }
    </Container>
  )
}