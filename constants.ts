import { ReportData } from './types';

export const MOCK_REPORT_DATA: ReportData = {
  reportDate: "2025年12月9日",
  reporter: "Lucy Zhang",
  metrics: {
    target: 1320000.00,
    achieved: 371099.50,
    percentage: 28.11,
    timeProgress: 92,
    status: 'Severe Lag' // Kept as key for logic, translated in UI
  },
  sprintQ4: {
    completed: 123925,
    pending: 65247,
    invalid: 370000
  },
  individualPerformance: [
    { rank: 1, name: "James Guo", target: 630000, achieved: 272049.83, percentage: 43.18, risk: "2 笔项目处于报价/提案阶段。" },
    { rank: 2, name: "May Wang", target: 230000, achieved: 41418.69, percentage: 18.01, risk: "重点待签：广州澳电通 28,449 NSOV，谈判中。" },
    { rank: 3, name: "Eva Li", target: 230000, achieved: 39630.98, percentage: 17.23, risk: "1 笔项目谈判中 (客户盖章中)。" },
    { rank: 4, name: "Grace Zhao", target: 230000, achieved: 37300.98, percentage: 16.22, risk: "4 笔项目处于提案阶段。" },
    { rank: 5, name: "Justin Tang", target: 230000, achieved: 18000.00, percentage: 7.83, risk: "1 笔项目谈判中，下周发起流程。" },
  ],
  funnel: [
    { name: "初步接洽", count: 73, percentage: 64, issue: "高密度堆积，需重点提高筛选及需求分析效率。" },
    { name: "需求分析", count: 23, percentage: 20, issue: "" },
    { name: "提案/报价/谈判", count: 18, percentage: 16, issue: "核心冲刺区 (12月预计 65,247 NSOV 主要来源)。" },
  ],
  actionItems: [
    { id: "A1", issue: "年度目标达成率低", risk: "目标年度无法达成，需快速干预和资源倾斜。", action: "例会首要议题：制定 Q4 最后的资源倾斜和行动计划。" },
    { id: "A2", issue: "环迅通科技年付款未付", risk: "账款逾期风险，需专业介入。", action: "例会议题：确认法务追款进度和下一步策略。" },
    { id: "A3", issue: "无效 SOV 占比高 (37w 中有 11w)", risk: "影响团队效率和士气。", action: "例会议题：复盘无效 SOV 的原因，优化合同/流程风控环节。" },
    { id: "A4", issue: "华天科技服务器传输故障", risk: "影响客户体验和业务稳定性。", action: "会后跟进：确保 SC 团队快速获取测试结果并解决。" },
    { id: "A5", issue: "中保车服暂停", risk: "需高层拜访重启合作。", action: "例会议题：准备高层拜访材料 (12月15日)，确定合作方向。" },
  ],
  nextWeekAgenda: [
    "年度冲刺与低效能分析：讨论年度目标的最后冲刺方案，并分析 Justin/Eva/May/Grace 达成率低的原因。",
    "漏斗与无效 SOV 优化：如何快速转化堆积在“初步接洽”阶段的 73 个商机？如何减少 30% 的无效 SOV？",
    "高层拜访与重点项目：确认中保车服 (12月15日) 和易点天下 (1月初) 的拜访目标和所需资源。",
    "逾期账单与法务进展：跟进环迅通科技、跨云桥的法务处理进度；解决 LIZHONG 西语合同和 Time Honestar 支付系统问题。"
  ]
};