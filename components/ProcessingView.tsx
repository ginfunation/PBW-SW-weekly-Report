import React, { useEffect, useState } from 'react';
import { Scan, BrainCircuit, FileCheck, CheckCircle2 } from 'lucide-react';

interface ProcessingViewProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, label: "正在扫描文档 (OCR)...", icon: Scan },
  { id: 2, label: "提取关键销售数据...", icon: FileCheck },
  { id: 3, label: "AI 分析风险与机会...", icon: BrainCircuit },
  { id: 4, label: "正在套用优化模板...", icon: CheckCircle2 },
];

export const ProcessingView: React.FC<ProcessingViewProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 800); 
          return prev;
        }
        return prev + 1;
      });
    }, 1200); 

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">正在生成报告</h2>
      
      <div className="w-full space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                isActive 
                  ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
                  : isCompleted 
                    ? 'border-green-200 bg-green-50 opacity-80'
                    : 'border-transparent opacity-40'
              }`}
            >
              <div className={`p-2 rounded-full ${
                isActive ? 'bg-blue-100 text-blue-600 animate-pulse' : 
                isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={`font-medium ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                {step.label}
              </span>
              {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};