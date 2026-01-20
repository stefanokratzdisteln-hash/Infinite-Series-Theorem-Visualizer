
import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import MathFormula from './MathFormula';
import { Info, AlertCircle, CheckCircle2, TrendingUp, Zap } from 'lucide-react';

type CaseType = 'normal' | 'zero' | 'infinity';

const LimitComparisonVisualizer: React.FC = () => {
  const [p, setP] = useState(1.0); // 默认为发散临界点 1
  const [cValue, setCValue] = useState(1.5);
  const [caseType, setCaseType] = useState<CaseType>('normal');
  const [maxN, setMaxN] = useState(40);

  // 当切换情形时，自动调整 p 值以展示最典型的案例
  useEffect(() => {
    if (caseType === 'infinity') setP(1.0); // 发散参考项
    if (caseType === 'zero') setP(1.2);    // 收敛参考项
  }, [caseType]);

  const { data, lastRatio } = useMemo(() => {
    const arr = [];
    let sumAn = 0;
    let sumBn = 0;
    let finalRatio = 0;

    for (let n = 1; n <= maxN; n++) {
      const bn = 1 / Math.pow(n, p);
      let an = 0;
      
      if (caseType === 'normal') {
        an = cValue * bn + (Math.random() - 0.5) * 0.02 / n;
      } else if (caseType === 'zero') {
        // 比值趋向 0：an = bn / ln(n+1)
        an = bn / (Math.log(n + 1) + 1);
      } else {
        // 比值趋向 ∞：an = bn * (0.5 * Math.sqrt(n))
        an = bn * (Math.pow(n, 0.4));
      }

      sumAn += an;
      sumBn += bn;
      const ratio = an / bn;
      finalRatio = ratio;

      arr.push({
        n,
        an: Number(an.toFixed(5)),
        bn: Number(bn.toFixed(5)),
        sumAn: Number(sumAn.toFixed(4)),
        sumBn: Number(sumBn.toFixed(4)),
        ratio: Number(ratio.toFixed(4))
      });
    }
    return { data: arr, lastRatio: finalRatio };
  }, [p, cValue, caseType, maxN]);

  const bnConvergent = p > 1;
  let conclusion = "";
  let statusColor = "text-slate-600";
  let bgHighlight = "bg-slate-50";
  let Icon = Info;

  if (caseType === 'normal') {
    conclusion = bnConvergent ? "同收敛：a_n 受到 b_n 的压制，无法逃逸" : "同发散：a_n 紧随 b_n 的脚步冲向无穷";
    statusColor = bnConvergent ? "text-green-600" : "text-red-600";
    bgHighlight = bnConvergent ? "bg-green-50" : "bg-red-50";
    Icon = bnConvergent ? CheckCircle2 : AlertCircle;
  } else if (caseType === 'zero') {
    conclusion = bnConvergent ? "b_n 收敛且 a_n 跑得更快，故 a_n 必收敛" : "b_n 发散但 a_n 跑得更快，尚不足以判断 a_n";
    statusColor = bnConvergent ? "text-green-600" : "text-amber-600";
    bgHighlight = bnConvergent ? "bg-green-50" : "bg-amber-50";
  } else if (caseType === 'infinity') {
    conclusion = !bnConvergent ? "b_n 已发散且 a_n 比它更猛，故 a_n 必发散！" : "b_n 虽然收敛，但 a_n 远大于它，结论不确定";
    statusColor = !bnConvergent ? "text-red-600" : "text-amber-600";
    bgHighlight = !bnConvergent ? "bg-red-50" : "bg-amber-50";
    Icon = !bnConvergent ? TrendingUp : Info;
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <header className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">定理 11：极限比较判别法</h2>
            <p className="text-slate-500 text-sm">通过与已知级数 <MathFormula formula="b_n" /> 的速率对比来判定敛散性</p>
          </div>
          <div className={`px-4 py-2 rounded-full border ${statusColor} ${bgHighlight} font-bold text-sm flex items-center gap-2 animate-pulse`}>
            <Zap size={16} />
            实时状态：{caseType === 'infinity' && !bnConvergent ? '发散确认' : '观察中'}
          </div>
        </header>
        
        {/* 顶部快捷切换 */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'normal', label: '标准 (c > 0)', desc: '同量级对比' },
            { id: 'zero', label: '零极限 (c = 0)', desc: 'a_n 更快趋向0' },
            { id: 'infinity', label: '无限极限 (c = ∞)', desc: 'a_n 衰减极慢' }
          ].map((caseItem) => (
            <button
              key={caseItem.id}
              onClick={() => setCaseType(caseItem.id as CaseType)}
              className={`flex-1 min-w-[140px] p-4 rounded-xl border-2 transition-all text-left ${
                caseType === caseItem.id 
                  ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100' 
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`text-xs font-black uppercase mb-1 ${caseType === caseItem.id ? 'text-blue-600' : 'text-slate-400'}`}>
                {caseItem.label}
              </div>
              <div className="text-sm font-bold text-slate-700">{caseItem.desc}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* 控制面板 */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-700 text-xs uppercase tracking-widest mb-6 border-b pb-2">参数实验室</h3>
              
              <div className="space-y-8">
                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      参考指数 <MathFormula formula="p" />
                    </span>
                    <span className={`text-xs font-black px-2 py-1 rounded ${bnConvergent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {bnConvergent ? '参考收敛' : '参考发散'}
                    </span>
                  </label>
                  <input type="range" min="0.2" max="2.5" step="0.1" value={p} onChange={(e) => setP(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800" />
                  <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold">
                    <span>发散区 (p≤1)</span>
                    <span>收敛区 (p>1)</span>
                  </div>
                </div>

                {caseType === 'normal' && (
                  <div>
                    <label className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
                      <span>固定极限比值 <MathFormula formula="c" /></span>
                      <span className="text-blue-600">{cValue}</span>
                    </label>
                    <input type="range" min="0.1" max="4" step="0.1" value={cValue} onChange={(e) => setCValue(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                )}

                <div className={`p-5 rounded-xl border-l-4 shadow-sm transition-all ${statusColor.replace('text', 'border')} ${bgHighlight}`}>
                  <h5 className="flex items-center gap-2 text-sm font-black mb-3">
                    <Icon size={20} className={statusColor} />
                    判定结论
                  </h5>
                  <div className={`text-xs leading-relaxed font-bold ${statusColor}`}>
                    <MathFormula formula={conclusion} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-indigo-900 text-indigo-100 rounded-2xl shadow-lg">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">当前实时比值趋势</h4>
              <div className="text-3xl font-black italic">
                {caseType === 'infinity' ? lastRatio.toFixed(2) + ' → ∞' : lastRatio.toFixed(3)}
              </div>
              <p className="text-[10px] mt-2 opacity-80">
                {caseType === 'infinity' ? '注意：比值随 n 增大而持续膨胀，表示 a_n 衰减极度缓慢。' : '比值已进入稳定区间。'}
              </p>
            </div>
          </div>

          {/* 图表可视化 */}
          <div className="xl:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 项的大小对比 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> 序列项 <MathFormula formula="a_n" /> vs <MathFormula formula="b_n" />
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="n" hide />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="an" stroke="#3b82f6" strokeWidth={3} dot={false} name="a_n (目标)" />
                      <Line type="monotone" dataKey="bn" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="b_n (参考)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 比值演化 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" /> 极限比值演化 <MathFormula formula="a_n / b_n" />
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="n" />
                      <YAxis domain={caseType === 'infinity' ? [0, 'auto'] : [0, Math.max(cValue * 1.5, 2)]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="ratio" stroke="#6366f1" fill="#e0e7ff" name="实时比值" />
                      {caseType === 'normal' && <ReferenceLine y={cValue} stroke="#10b981" strokeDasharray="5 5" />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 部分和图表 - 决定敛散性的终极判据 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> 
                  级数部分和 <MathFormula formula="S_n = \sum_{k=1}^n a_k" /> (敛散性的本质)
                </span>
                {caseType === 'infinity' && !bnConvergent && (
                  <span className="text-red-500 font-black animate-bounce">WARNING: EXPLOSIVE GROWTH</span>
                )}
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorSum" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={caseType === 'infinity' && !bnConvergent ? "#ef4444" : "#10b981"} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={caseType === 'infinity' && !bnConvergent ? "#ef4444" : "#10b981"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="n" label={{ value: '项数 n', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                    <YAxis label={{ value: '累加和', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="sumAn" 
                      stroke={caseType === 'infinity' && !bnConvergent ? "#ef4444" : "#10b981"} 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorSum)" 
                      name="a_n 的部分和" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sumBn" 
                      stroke="#94a3b8" 
                      strokeWidth={1} 
                      strokeDasharray="3 3" 
                      fill="none" 
                      name="b_n 的部分和" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex gap-6 text-[10px] font-bold text-slate-400 justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-1 bg-emerald-500" /> 目标级数和</div>
                <div className="flex items-center gap-1"><div className="w-3 h-1 bg-slate-400 border-t border-dashed" /> 参考级数和</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitComparisonVisualizer;
