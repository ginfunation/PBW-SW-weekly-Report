import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface UploadViewProps {
  onUploadStart: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onUploadStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadStart();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadStart();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">销售周报自动化生成</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          上传您的 PDF 或图片周报。智能引擎 (OCR + Gemini AI) 将自动提取数据、分析风险并生成管理层报告。
        </p>
      </div>

      <div
        className={`w-full max-w-2xl h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-lg font-medium text-slate-700">点击上传或拖拽文件至此</p>
        <p className="text-sm text-slate-400 mt-2">支持 PDF, PNG, JPG (最大 10MB)</p>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg"
        />
      </div>

      <div className="mt-8 flex gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>智能 OCR 识别</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>风险自动检测</span>
        </div>
      </div>
    </div>
  );
};