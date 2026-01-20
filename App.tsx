
import React, { useState } from 'react';
import { TheoremType } from './types';
import LimitComparisonVisualizer from './components/LimitComparisonVisualizer';
import RatioTestVisualizer from './components/RatioTestVisualizer';
import AlternatingSeriesVisualizer from './components/AlternatingSeriesVisualizer';
import RearrangementVisualizer from './components/RearrangementVisualizer';
import { Sigma, ArrowRightLeft, Percent, Scale, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTheorem, setActiveTheorem] = useState<TheoremType>(TheoremType.LIMIT_COMPARISON);

  const renderVisualizer = () => {
    switch (activeTheorem) {
      case TheoremType.LIMIT_COMPARISON:
        return <LimitComparisonVisualizer />;
      case TheoremType.RATIO_TEST:
        return <RatioTestVisualizer />;
      case TheoremType.ALTERNATING_SERIES:
        return <AlternatingSeriesVisualizer />;
      case TheoremType.REARRANGEMENT:
        return <RearrangementVisualizer />;
      default:
        return null;
    }
  };

  const navItems = [
    { type: TheoremType.LIMIT_COMPARISON, icon: <Scale size={18} />, label: "比较判别法" },
    { type: TheoremType.RATIO_TEST, icon: <Percent size={18} />, label: "比值判别法" },
    { type: TheoremType.ALTERNATING_SERIES, icon: <Sigma size={18} />, label: "交错级数" },
    { type: TheoremType.REARRANGEMENT, icon: <ArrowRightLeft size={18} />, label: "重排定理" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-full text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-slate-100 bg-blue-600 text-white">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Sigma className="text-blue-200" />
            级数定理可视化
          </h1>
          <p className="text-xs text-blue-100 mt-1 opacity-80">Geogebra 交互式学习工具</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.type}
              onClick={() => setActiveTheorem(item.type)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTheorem === item.type
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info size={14} />
            <span>拖动滑块调整参数</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-slate-100 overflow-hidden">
        {renderVisualizer()}
      </main>
    </div>
  );
};

export default App;
