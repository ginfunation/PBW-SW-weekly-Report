import { GoogleGenAI } from "@google/genai";
import { ReportData } from "../types";

export const generateExecutiveSummary = async (data: ReportData): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Returning mock summary.");
    return "API Key 缺失。请提供有效的 Gemini API Key 以生成实时洞察。根据数据，团队严重滞后于年度目标（完成 28.11%，时间已过 92%）。需立即重点关注处于提案阶段的 18 个商机，并解决“无效 SOV”问题。";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    你是一位资深的销售运营总监。请分析以下销售周报数据，并提供一份简明扼要、直击痛点的执行摘要 (Exec Summary) (最多 150 字)。
    重点关注“严重滞后”的状态、关键风险 (A1-A5)，以及 Q4 冲刺所需的具体行动。
    请使用专业、紧迫但富有建设性的中文语气。
    
    数据:
    ${JSON.stringify(data, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "无法生成摘要。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "生成 AI 摘要时出错。请检查您的网络或 API Key 配额。";
  }
};