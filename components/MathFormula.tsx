
import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

const MathFormula: React.FC<MathFormulaProps> = ({ formula, displayMode = false, className = "" }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
      });
    } catch (error) {
      console.error("KaTeX error:", error);
      return formula;
    }
  }, [formula, displayMode]);

  return (
    <span 
      className={className} 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

export default MathFormula;
