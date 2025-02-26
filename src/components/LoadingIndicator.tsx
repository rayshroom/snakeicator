'use client';

import { useState, useEffect } from 'react';

interface LoadingIndicatorProps {
  size?: number;
  color?: string;
  speed?: number;
  type?: 'spinner';
  length?: number; // 控制蛇的长度，范围 0-0.9
  pattern?: 'scales' | 'dots' | 'zigzag';
}

const LoadingIndicator = ({
  size = 60,
  color = '#10B981',
  speed = 1,
  type = 'spinner',
  length = 0.8,
  pattern = 'scales'
}: LoadingIndicatorProps) => {
  const [rotation, setRotation] = useState(0);
  const [currentLength, setCurrentLength] = useState(length);
  const [startAngle, setStartAngle] = useState(0);
  const [phase, setPhase] = useState<'extending' | 'retracting'>('extending');

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2 * speed) % 360);
      
      if (length <= 0.7) {
        // 振动逻辑
        if (phase === 'extending') {
          // 头部延伸阶段
          setCurrentLength(prev => {
            const next = prev + 0.01;
            if (next >= 0.7) {
              setPhase('retracting');
              return 0.7;
            }
            return next;
          });
        } else {
          // 尾部收缩阶段 - 保持头部位置不变，移动尾部
          const targetLength = length;
          const maxLength = 0.7;
          const currentArc = maxLength * 360;
          const targetArc = targetLength * 360;
          const totalDiff = currentArc - targetArc;

          setStartAngle(prev => {
            const next = prev + (totalDiff / 50);
            if (next >= totalDiff) {
              setPhase('extending');
              setCurrentLength(targetLength);
              return 0;
            }
            return next;
          });
        }
      } else {
        setCurrentLength(length);
        setStartAngle(0);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [speed, length, phase]);

  // 当length改变时重置状态
  useEffect(() => {
    if (length > 0.7) {
      setCurrentLength(length);
      setStartAngle(0);
      setPhase('extending');
    } else {
      setCurrentLength(Math.min(length, 0.7));
      setStartAngle(0);
      setPhase('extending');
    }
  }, [length]);

  // 计算圆弧路径和端点位置
  const calculateArcPath = (radius: number, startAngle: number, endAngle: number) => {
    // 将角度转换为弧度
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;

    // 计算起点和终点坐标
    const startX = 25 + radius * Math.cos(start);
    const startY = 25 + radius * Math.sin(start);
    const endX = 25 + radius * Math.cos(end);
    const endY = 25 + radius * Math.sin(end);

    // 确定是否使用大弧
    const largeArcFlag = (endAngle - startAngle) <= 180 ? "0" : "1";

    return {
      path: `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      startPoint: { x: startX, y: startY },
      endPoint: { x: endX, y: endY }
    };
  };

  // 生成蛇的鳞片图案
  const generatePattern = (patternType: string, start: number, end: number) => {
    const arcLength = end - start;
    const totalLength = Math.PI * 40;
    const patternCount = Math.floor((arcLength / 360) * totalLength / 8);
    const patterns = [];
    
    for (let i = 0; i < patternCount; i++) {
      const progress = i / patternCount;
      const angle = (start + progress * arcLength) * Math.PI / 180;
      const r = 20;
      const x = 25 + r * Math.cos(angle);
      const y = 25 + r * Math.sin(angle);
      
      switch (patternType) {
        case 'scales':
          patterns.push(
            <path
              key={i}
              d={`M ${x} ${y} l -2 2 l 2 2 l 2 -2 z`}
              fill={color}
              opacity={0.6}
              transform={`rotate(${45 + progress * arcLength}, ${x}, ${y})`}
            />
          );
          break;
        case 'dots':
          patterns.push(
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1}
              fill={color}
              opacity={0.6}
            />
          );
          break;
        case 'zigzag':
          if (i % 2 === 0) {
            patterns.push(
              <line
                key={i}
                x1={x}
                y1={y}
                x2={x + 2}
                y2={y + 2}
                stroke={color}
                strokeWidth={1}
                opacity={0.6}
              />
            );
          }
          break;
      }
    }
    return patterns;
  };

  const renderIndicator = () => {
    switch (type) {
      case 'spinner':
        const endAngle = Math.min(currentLength * 360, 324); // 90% = 324度
        const { path, startPoint, endPoint } = calculateArcPath(20, startAngle, endAngle);
        
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 50 50"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <defs>
              <linearGradient id="spinnerGradient" gradientTransform="rotate(0)">
                <stop offset="0%" stopColor={color} stopOpacity="1" />
                <stop offset="50%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            {/* 蛇身主体 */}
            <path
              d={path}
              fill="none"
              strokeWidth="4"
              stroke="url(#spinnerGradient)"
              strokeLinecap="round"
            />
            
            {/* 图案装饰 */}
            {generatePattern(pattern, startAngle, endAngle)}
            
            {/* 蛇尾 */}
            <circle
              cx={startPoint.x}
              cy={startPoint.y}
              r="2"
              fill={color}
              opacity={0.6}
            />
            
            {/* 蛇头 */}
            <g transform={`rotate(${endAngle - startAngle}, ${endPoint.x}, ${endPoint.y})`}>
              <circle
                cx={endPoint.x}
                cy={endPoint.y}
                r="3"
                fill={color}
              />
              {/* 蛇眼 */}
              <circle
                cx={endPoint.x - 1}
                cy={endPoint.y - 1}
                r="0.8"
                fill="white"
              />
              <circle
                cx={endPoint.x + 1}
                cy={endPoint.y - 1}
                r="0.8"
                fill="white"
              />
            </g>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderIndicator()}
    </div>
  );
};

export default LoadingIndicator; 