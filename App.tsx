import React, { useState } from 'react';
import { UploadView } from './components/UploadView';
import { ProcessingView } from './components/ProcessingView';
import { ReportView } from './components/ReportView';
import { MOCK_REPORT_DATA } from './constants';

type AppStep = 'upload' | 'processing' | 'report';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('upload');

  const handleUploadStart = () => {
    setStep('processing');
  };

  const handleProcessingComplete = () => {
    setStep('report');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
                <span className="font-semibold text-lg tracking-tight text-slate-800">PBW-SW <span className="text-blue-600">Weekly Report</span></span>
            </div>
            {step === 'report' && (
                <button 
                  onClick={() => setStep('upload')}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  新建报告
                </button>
            )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0 print:px-0">
        {step === 'upload' && <UploadView onUploadStart={handleUploadStart} />}
        {step === 'processing' && <ProcessingView onComplete={handleProcessingComplete} />}
        {step === 'report' && <ReportView data={MOCK_REPORT_DATA} />}
      </main>
    </div>
  );
};

export default App;