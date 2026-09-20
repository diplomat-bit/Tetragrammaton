import React, { useState, useRef, UIEvent } from 'react';

export interface FixedSizeListProps {
  height: number | string;
  width?: number | string;
  itemCount: number;
  itemSize: number;
  children: (props: { index: number; style: React.CSSProperties }) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  overscanCount?: number;
}

export const FixedSizeList: React.FC<FixedSizeListProps> = ({
  height,
  width = '100%',
  itemCount,
  itemSize,
  children: Row,
  className,
  style,
  overscanCount = 4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = Math.max(0, itemCount * itemSize);
  const numHeight = typeof height === 'number' ? height : 500;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemSize) - overscanCount);
  const endIndex = Math.min(itemCount - 1, Math.floor((scrollTop + numHeight) / itemSize) + overscanCount);

  const items = [];
  for (let i = startIndex; i <= endIndex; i++) {
    items.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: i * itemSize,
          left: 0,
          width: '100%',
          height: itemSize,
        }}
      >
        {Row({
          index: i,
          style: {
            width: '100%',
            height: '100%',
          },
        })}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={`overflow-y-auto relative ${className || ''}`}
      style={{
        ...style,
        height,
        width,
      }}
    >
      <div style={{ height: totalHeight, width: '100%', position: 'relative' }}>
        {items}
      </div>
    </div>
  );
};

export const List = FixedSizeList;
export const VariableSizeList = FixedSizeList;
export const FixedSizeGrid = ({ children, ...props }: any) => <div>{children}</div>;
export const VariableSizeGrid = ({ children, ...props }: any) => <div>{children}</div>;
export const areEqual = (prevProps: any, nextProps: any) => prevProps === nextProps;
export const shouldComponentUpdate = () => true;

export default FixedSizeList;
