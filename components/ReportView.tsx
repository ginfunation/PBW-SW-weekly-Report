import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  FunnelChart, Funnel, LabelList 
} from 'recharts';
import { 
  AlertTriangle, Calendar, User, Target, TrendingUp, 
  Briefcase, Download, Sparkles, CheckSquare, Plus, Trash2 
} from 'lucide-react';
import { ReportData, ActionItem } from '../types';
import { generateExecutiveSummary } from '../services/geminiService';

interface ReportViewProps {
  data: ReportData;
}

export const ReportView: React.FC<ReportViewProps> = ({ data: initialData }) => {
  const [data, setData] = useState<ReportData>(initialData);
  const [summary, setSummary] = useState<string>("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoadingAi(true);
    const result = await generateExecutiveSummary(data);
    setSummary(result);
    setIsLoadingAi(false);
  };

  const handleExportPDF = () => {
    // Timeout ensures any recent state updates or re-renders settle before printing
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const getMetricColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage < 30) return "#ef4444"; // Red
    if (percentage < 60) return "#f59e0b"; // Amber
    return "#22c55e"; // Green
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(val);
  };

  // --- Editable Logic for Action Items ---
  const handleActionItemChange = (id: string, field: keyof ActionItem, value: string) => {
    setData(prev => ({
      ...prev,
      actionItems: prev.actionItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddActionItem = () => {
    const newId = `A${data.actionItems.length + 1}`;
    setData(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, { id: newId, issue: "新问题", risk: "请输入风险描述", action: "请输入建议行动" }]
    }));
  };

  const handleDeleteActionItem = (id: string) => {
    setData(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter(item => item.id !== id)
    }));
  };

  // --- Editable Logic for Agenda ---
  const handleAgendaChange = (index: number, value: string) => {
    const newAgenda = [...data.nextWeekAgenda];
    newAgenda[index] = value;
    setData(prev => ({ ...prev, nextWeekAgenda: newAgenda }));
  };

  const handleAddAgenda = () => {
    setData(prev => ({
      ...prev,
      nextWeekAgenda: [...prev.nextWeekAgenda, "请输入新的议题..."]
    }));
  };

  const handleDeleteAgenda = (index: number) => {
    const newAgenda = data.nextWeekAgenda.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, nextWeekAgenda: newAgenda }));
  };

  const translateStatus = (status: string) => {
    if (status === 'Severe Lag') return '严重滞后';
    if (status === 'At Risk') return '有风险';
    return '正常';
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-8 print:space-y-6 print:pb-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Southwest Division 销售周报</h1>
          <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {data.reportDate}</span>
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> 报告人：{data.reporter}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 no-print">
            <button 
                onClick={handleGenerateSummary}
                disabled={isLoadingAi}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 font-medium"
            >
                <Sparkles className="w-4 h-4" />
                {isLoadingAi ? "思考中..." : "SOP 分析"}
            </button>
            <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-md"
            >
                <Download className="w-4 h-4" />
                导出 PDF
            </button>
        </div>
      </div>

      {/* AI Summary Section */}
      {summary && (
        <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl border border-purple-100 shadow-sm animate-fade-in print:border-slate-200 print:shadow-none">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-purple-900">SOP 执行建议</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-line">{summary}</p>
        </div>
      )}

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 print:gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-slate-200 print:shadow-none">
            <p className="text-sm font-medium text-slate-500 mb-1">年度目标总额 (RMB)</p>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.metrics.target)}</div>
            <Target className="w-8 h-8 text-blue-100 absolute top-6 right-6 print:hidden" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-slate-200 print:shadow-none">
            <p className="text-sm font-medium text-slate-500 mb-1">累计完成 (SOV)</p>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.metrics.achieved)}</div>
            <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-red-600">{data.metrics.percentage}%</span>
                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden print:bg-slate-200">
                    <div className="h-full bg-red-500 rounded-full print:bg-red-600" style={{ width: `${data.metrics.percentage}%` }}></div>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-slate-200 print:shadow-none">
            <p className="text-sm font-medium text-slate-500 mb-1">时间进度</p>
            <div className="text-2xl font-bold text-slate-900">{data.metrics.timeProgress}%</div>
             <p className="text-xs text-slate-400 mt-1">年度即将结束</p>
        </div>
         <div className={`p-6 rounded-xl shadow-sm border flex flex-col justify-center items-center text-center print:shadow-none ${data.metrics.status === 'Severe Lag' ? 'bg-red-50 border-red-200 print:bg-red-50' : 'bg-white border-slate-200'}`}>
            <AlertTriangle className={`w-8 h-8 mb-2 ${data.metrics.status === 'Severe Lag' ? 'text-red-600' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">当前状态</p>
            <div className="text-xl font-extrabold text-red-700">{translateStatus(data.metrics.status)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:space-y-6">
        {/* Individual Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 break-inside-avoid print:border-slate-200 print:shadow-none">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                团队绩效排名 (基于 NSVO Target)
            </h3>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.individualPerformance} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fill: '#475569', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            formatter={(value: number) => [`${value}%`, '达成率']}
                        />
                        <Bar dataKey="percentage" barSize={24} radius={[0, 4, 4, 0]}>
                            {data.individualPerformance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getMetricColor(entry.achieved, entry.target)} />
                            ))}
                            <LabelList dataKey="percentage" position="right" formatter={(val: number) => `${val}%`} fill="#64748b" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {data.individualPerformance.map(p => (
                     <div key={p.name} className="text-xs bg-slate-50 p-2 rounded border border-slate-100 print:bg-white print:border-slate-200">
                         <span className="font-bold text-slate-700">{p.name}:</span> <span className="text-slate-500">{p.risk}</span>
                     </div>
                 ))}
            </div>
        </div>

        {/* Funnel Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 break-inside-avoid print:border-slate-200 print:shadow-none">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                商机漏斗分析
            </h3>
            <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                        <Tooltip />
                        <Funnel
                            dataKey="count"
                            data={data.funnel}
                            isAnimationActive
                        >
                            <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                             {data.funnel.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#3b82f6', '#6366f1', '#8b5cf6'][index % 3]} />
                            ))}
                        </Funnel>
                    </FunnelChart>
                 </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
                {data.funnel.map((stage) => (
                    <div key={stage.name} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0">
                        <span className="text-slate-600">{stage.name}</span>
                        <div className="flex flex-col items-end">
                             <span className="font-bold text-slate-900">{stage.count} 个</span>
                             <span className="text-xs text-slate-400">{stage.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Management Actions Table (Editable) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden break-inside-avoid print:border-slate-200 print:shadow-none">
        <div className="p-6 border-b border-slate-100 bg-red-50/50 flex justify-between items-center print:bg-red-50">
            <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                管理层行动清单 (需立即处理)
            </h3>
            <button onClick={handleAddActionItem} className="flex items-center gap-1 text-sm text-red-700 hover:text-red-800 font-medium no-print">
              <Plus className="w-4 h-4" /> 添加
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 print:bg-slate-100">
                    <tr>
                        <th className="px-6 py-3 font-medium w-16">编号</th>
                        <th className="px-6 py-3 font-medium">问题描述 (来源)</th>
                        <th className="px-6 py-3 font-medium">风险/影响</th>
                        <th className="px-6 py-3 font-medium">建议管理层行动</th>
                        <th className="px-6 py-3 font-medium w-16 no-print">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {data.actionItems.map((item) => (
                        <tr key={item.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 group">
                            <td className="px-6 py-4 font-bold text-slate-900 align-top">{item.id}</td>
                            <td className="px-6 py-4 align-top">
                              <textarea 
                                className="w-full bg-transparent border border-transparent hover:border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white resize-none"
                                value={item.issue} 
                                onChange={(e) => handleActionItemChange(item.id, 'issue', e.target.value)}
                                rows={2}
                              />
                            </td>
                            <td className="px-6 py-4 align-top">
                               <textarea 
                                className="w-full bg-transparent border border-transparent hover:border-slate-300 rounded px-2 py-1 text-slate-600 italic focus:outline-none focus:border-blue-400 focus:bg-white resize-none"
                                value={item.risk} 
                                onChange={(e) => handleActionItemChange(item.id, 'risk', e.target.value)}
                                rows={2}
                              />
                            </td>
                            <td className="px-6 py-4 font-medium text-blue-700 align-top">
                              <textarea 
                                className="w-full bg-transparent border border-transparent hover:border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-blue-400 focus:bg-white resize-none"
                                value={item.action} 
                                onChange={(e) => handleActionItemChange(item.id, 'action', e.target.value)}
                                rows={2}
                              />
                            </td>
                            <td className="px-6 py-4 no-print align-top">
                              <button 
                                onClick={() => handleDeleteActionItem(item.id)}
                                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Next Week Agenda (Editable) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 break-inside-avoid print:border-slate-200 print:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              下周例会议题建议
            </h3>
            <button onClick={handleAddAgenda} className="flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium no-print">
              <Plus className="w-4 h-4" /> 添加
            </button>
          </div>
          
          <ul className="space-y-4">
              {data.nextWeekAgenda.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                      <CheckSquare className="w-5 h-5 text-green-500 shrink-0 mt-2" />
                      <div className="flex-1">
                        <textarea
                          className="w-full bg-transparent border border-transparent hover:border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white resize-none"
                          value={item}
                          onChange={(e) => handleAgendaChange(idx, e.target.value)}
                          rows={2}
                        />
                      </div>
                      <button 
                        onClick={() => handleDeleteAgenda(idx)}
                        className="mt-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </li>
              ))}
          </ul>
      </div>

    </div>
  );
};