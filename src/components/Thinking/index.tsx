import checkPng from '@/assets/check.png';
import loadingImg from '@/assets/loading.svg';
import { useI18n } from '@/i18n';
import { IRecall } from '@/typings';
import { PropsWithChildren, useState } from 'react';
import { FaRegStopCircle } from 'react-icons/fa';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';
import './index.less';

interface ThinkingProps {
  data: IRecall;
  count: number;
}

export default function Thinking({ data, count, children }: PropsWithChildren<ThinkingProps>) {
  const [expaned, setExpanded] = useState(true);
  const [expaned2, setExpanded2] = useState(false);
  const { text } = useI18n();

  if (!data.steps) return null;

  return (
    <div className="thinking-process">
      <div className="thinking-process__title" onClick={() => setExpanded(!expaned)}>
        {expaned ? <IoChevronDown /> : <IoChevronForward />}
        {text.recall.stepsTitle}
      </div>
      {expaned && (
        <div className="thinking-process__steps">
          {data.steps.map((step, index) => {
            return (
              <div key={index}>
                {step.status === 'loading' && <img src={loadingImg} className="ani-loading" />}
                {step.status === 'done' && <img src={checkPng} />}
                {step.status === 'terminated' && <FaRegStopCircle color="#F14C4C" />}
                <span>{text.recall.steps[index]}</span>
                <span className="flex-1 ellipsis" style={{ marginLeft: '1em' }}>
                  {text.recall.stepsDesc[index]}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {count > 0 && (
        <>
          <div className="thinking-process__title" onClick={() => setExpanded2(!expaned2)}>
            {expaned2 ? <IoChevronDown /> : <IoChevronForward />}
            {text.recall.resultTitle}
          </div>
          {expaned2 && (
            <div className="thinking-process__cnt">
              <div style={{ marginBottom: -8 }}>
                {text.recall.resultDesc}（{count}）
              </div>
              {children}
            </div>
          )}
        </>
      )}
    </div>
  );
}
