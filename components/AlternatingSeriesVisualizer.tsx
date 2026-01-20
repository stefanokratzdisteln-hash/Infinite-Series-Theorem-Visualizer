
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area, Legend } from 'recharts';
import MathFormula from './MathFormula';
import { Info, HelpCircle } from 'lucide-react';

const AlternatingSeriesVisualizer: React.FC = () => {
  const [decay, setDecay] = useState(0.7);
  const [maxN, setMaxN] = useState(12);

  const { data, limit } = useMemo(() => {
    const arr = [];
    let sum = 0;
    const exactLimit = decay / (1 + decay);

    for (let n = 1; n <= maxN; n++) {
      const un = Math.pow(decay, n);
      const term = Math.pow(-1, n + 1) * un;
      const prevSum = sum;
      sum += term;
      
      // The trap interval is between Sn and Sn-1 (which is the same as Sn and Sn+1)
      const un_plus_1 = Math.pow(decay, n + 1);
      
      arr.push({
        n,
        un: Number(un.toFixed(4)),
        sn: Number(sum.toFixed(4)),
        // Trap interval for Sn: Sn is one boundary, Sn + term_next is another
        trapMin: Math.min(sum, sum - (Math.pow(-1, n + 1) * un_plus_1)),
        trapMax: Math.max(sum, sum - (Math.pow(-1, n + 1) * un_plus_1)),
        un_plus_1: Number(un_plus_1.toFixed(4)),
        error: Number(Math.abs(exactLimit - sum).toFixed(4))
      });
    }
    return { data: arr, limit: exactLimit };
  }, [decay, maxN]);

  return (
    <div className="flex flex-col h-full p-6 space-y-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
          交错级数及其误差估计 (定理 15 & 16)
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
            <h3 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <Info size={16} /> 定理 15: 莱布尼茨判别法
            </h3>
            <MathFormula formula={`\\sum_{n=1}^{\\infty} (-1)^{n+1} u_n \\text{ 收敛, 若 } u_n \\ge u_{n+1} \\to 0`} displayMode={true} />
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
              <HelpCircle size={16} /> 定理 16: 误差估计 (本页重点)
            </h3>
            <MathFormula formula={`|R_n| = |L - S_n| \\le u_{n+1}`} displayMode={true} />
            <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1 flex-wrap">
              {/* Correcting JSX curly brace interpretation error: S_{n+1} was being read as an expression */}
              直观理解：和 <MathFormula formula="L" /> 永远落在 <MathFormula formula="S_n" /> 与 <MathFormula formula="S_{n+1}" /> 之间。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-700 border-b pb-2">调节参数</h4>
            <div>
              <label className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                <span>递减率</span>
                <MathFormula formula="r" />
                <span>(项大小为</span>
                <MathFormula formula="r^n" />
                <span>):</span>
                <span className="ml-auto font-bold text-emerald-600">{decay}</span>
              </label>
              <input type="range" min="0.1" max="0.95" step="0.01" value={decay} onChange={(e) => setDecay(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
              <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2">理论极限 L</h5>
              <div className="text-2xl font-serif text-slate-700 mb-1">
                {limit.toFixed(6)}
              </div>
              <p className="text-[10px] text-slate-400">
                公式: <MathFormula formula="L = \frac{r}{1+r}" />
              </p>
            </div>

            <div className="text-xs text-slate-500 space-y-2 leading-relaxed">
              <p>● <strong className="text-emerald-600">蛇形收敛</strong>：由于正负交替，部分和会绕着极限点左右跳动。</p>
              <p>● <strong className="text-blue-600">余项捕捉</strong>：注意阴影区域，它代表了极限 <MathFormula formula="L" /> 的“安全范围”。</p>
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-72 bg-white border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-bold text-slate-500 mb-2 px-2 flex justify-between items-center">
                {/* Correcting JSX brace interpretation for S_{n+1} and S_n for consistency */}
                <span>部分和 <MathFormula formula="S_n" /> 的收敛轨迹与“夹逼范围”</span>
                <span className="text-pink-500 italic flex items-center gap-1">阴影区域 = <MathFormula formula="[S_n, S_{n+1}]" /></span>
              </p>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="n" />
                  <YAxis domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                  <Tooltip />
                  <ReferenceLine y={limit} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Limit L', position: 'right', fill: '#10b981', fontSize: 10 }} />
                  {/* Trap Area */}
                  <Area type="monotone" dataKey="trapMax" stroke="none" fill="#fbcfe8" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="trapMin" stroke="none" fill="#fff" fillOpacity={1} />
                  {/* S_n path */}
                  <Area type="monotone" dataKey="sn" stroke="#ec4899" strokeWidth={3} fill="none" dot={{ r: 4, fill: '#ec4899' }} activeDot={{ r: 6 }} name="部分和 S_n" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="h-48 bg-white border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-bold text-slate-500 mb-2 px-2 flex items-center gap-2">
                误差验证: <MathFormula formula="|L - S_n|" className="text-red-500" /> vs 理论界限 <MathFormula formula="u_{n+1}" className="text-slate-500" />
              </p>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="n" />
                  <YAxis />
                  <Tooltip />
                  <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="stepAfter" dataKey="error" stroke="#f43f5e" strokeWidth={2} dot={false} name="实际误差 |R_n|" />
                  <Line type="stepAfter" dataKey="un_plus_1" stroke="#94a3b8" strokeDasharray="3 3" dot={false} name="首个舍弃项 u_{n+1}" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternatingSeriesVisualizer;
