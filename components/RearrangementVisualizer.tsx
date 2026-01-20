
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import MathFormula from './MathFormula';
import { Shuffle, RotateCcw } from 'lucide-react';

const RearrangementVisualizer: React.FC = () => {
  const [seed, setSeed] = useState(0);
  const [isAbsolute, setIsAbsolute] = useState(true);

  const { originalData, rearrangedData } = useMemo(() => {
    const nTerms = 30;
    const baseTerms = [];
    for (let i = 1; i <= nTerms; i++) {
      if (isAbsolute) {
        // Absolutely convergent: sum 1/2^n
        baseTerms.push(1 / Math.pow(1.5, i));
      } else {
        // Conditionally convergent: sum (-1)^(n+1) / n
        baseTerms.push(Math.pow(-1, i + 1) / i);
      }
    }

    // Shuffle terms for rearrangement
    const shuffledTerms = [...baseTerms];
    for (let i = shuffledTerms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTerms[i], shuffledTerms[j]] = [shuffledTerms[j], shuffledTerms[i]];
    }

    const oData = [];
    const rData = [];
    let oSum = 0;
    let rSum = 0;

    for (let i = 0; i < nTerms; i++) {
      oSum += baseTerms[i];
      rSum += shuffledTerms[i];
      oData.push({ n: i + 1, sum: oSum });
      rData.push({ n: i + 1, sum: rSum });
    }

    return { originalData: oData, rearrangedData: rData };
  }, [seed, isAbsolute]);

  return (
    <div className="flex flex-col h-full p-6 space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-800">定理 17：绝对收敛级数重排定理</h2>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500 mb-6">
          <MathFormula formula={`\\text{若 } \\sum a_n \\text{ 绝对收敛, 则其任意重排 } \\sum b_n \\text{ 均收敛且和相等。}`} displayMode={true} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-4">实验面板</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={isAbsolute} 
                  onChange={() => setIsAbsolute(!isAbsolute)}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400"
                />
                <span className="text-sm font-medium text-slate-700">绝对收敛 (1/1.5^n)</span>
              </label>
              {!isAbsolute && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 italic">
                  警告: 条件收敛级数重排可能改变其和，甚至使其发散 (黎曼重排定理)。
                </div>
              )}
            </div>

            <button 
              onClick={() => setSeed(s => s + 1)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-md transition-all active:scale-95"
            >
              <Shuffle size={18} />
              重新随机排列项
            </button>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 leading-relaxed">
                在绝对收敛的情况下，无论蓝线和红线如何波折，最终都会汇聚到同一个点。
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 h-[400px] bg-white border border-slate-200 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="n" label={{ value: '项数 n', position: 'bottom', offset: 0 }} />
                <YAxis label={{ value: '部分和 S_n', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36}/>
                <Line 
                  data={originalData} 
                  type="monotone" 
                  dataKey="sum" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 2 }} 
                  name="原始顺序" 
                />
                <Line 
                  data={rearrangedData} 
                  type="monotone" 
                  dataKey="sum" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  dot={{ r: 2 }} 
                  name="随机重排后" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RearrangementVisualizer;
