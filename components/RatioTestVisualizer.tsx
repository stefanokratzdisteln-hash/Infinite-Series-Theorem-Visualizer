
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import MathFormula from './MathFormula';

const RatioTestVisualizer: React.FC = () => {
  const [rho, setRho] = useState(0.8);
  const [maxN, setMaxN] = useState(15);

  const data = useMemo(() => {
    const arr = [];
    let currentAn = 1;
    for (let n = 1; n <= maxN; n++) {
      const nextAn = currentAn * rho;
      arr.push({
        n,
        val: Number(currentAn.toExponential(2)),
        ratio: rho,
        logVal: Math.log10(currentAn)
      });
      currentAn = nextAn;
    }
    return arr;
  }, [rho, maxN]);

  const status = rho < 1 ? '绝对收敛' : rho > 1 ? '发散' : '失效 (无法判断)';
  const statusColor = rho < 1 ? 'text-green-600' : rho > 1 ? 'text-red-600' : 'text-amber-600';

  return (
    <div className="flex flex-col h-full p-6 space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-800">定理 13：比值判别法 (The Ratio Test)</h2>
        <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500 mb-6">
          <MathFormula formula={`\\text{设 } \\lim_{n\\to\\infty} \\left| \\frac{a_{n+1}}{a_n} \\right| = \\rho. \\text{ (a) } \\rho < 1 \\text{ 收敛; (b) } \\rho > 1 \\text{ 发散; (c) } \\rho = 1 \\text{ 无结论。}`} displayMode={true} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-700 border-b pb-2">设置参数</h3>
            
            <div>
              <label className="flex justify-between text-sm text-slate-600 mb-1">
                <span>极限比值 $\rho$:</span>
                <span className={`font-bold ${statusColor}`}>{rho}</span>
              </label>
              <input type="range" min="0.5" max="1.5" step="0.01" value={rho} onChange={(e) => setRho(parseFloat(e.target.value))} className="w-full" />
              <div className="mt-4 p-3 bg-white rounded border border-slate-200 flex flex-col items-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">当前结论</span>
                <span className={`text-lg font-bold ${statusColor}`}>{status}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed italic">
              观察当 $\rho$ 略小于 1 时，项 $a_n$ 迅速减小至 0；而当 $\rho > 1$ 时，级数项呈指数级增长。
            </div>
          </div>

          <div className="lg:col-span-2 h-[450px] bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-slate-600 mb-4">项的大小序列 (对数坐标模拟视角)</p>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="n" label={{ value: 'n', position: 'insideBottomRight', offset: -10 }} />
                <YAxis label={{ value: '|an|', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                   formatter={(value: any, name: string) => name === 'val' ? [value.toExponential(2), '|a_n|'] : [value, name]}
                />
                <ReferenceLine y={1} stroke="#64748b" strokeDasharray="3 3" label="Threshold 1" />
                <Bar dataKey="val">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={rho < 1 ? '#10b981' : rho > 1 ? '#ef4444' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatioTestVisualizer;
