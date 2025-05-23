// components/forms/identificacao-avaliacao-riscos/risk-matrix.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface RiskMatrixProps {
  intensity: 'BAIXA' | 'MEDIA' | 'ALTA' | string;
  probability:
    | 'IMPROVAVEL'
    | 'PROVAVEL'
    | 'ALTAMENTE_PROVAVEL'
    | 'DEFINITIVA'
    | string;
  onChange?: (significance: string) => void;
}

export const RiskMatrix = ({
  intensity,
  probability,
  onChange,
}: RiskMatrixProps) => {
  const [significance, setSignificance] = useState<string>('');

  // Map to translate enum values to indices
  const intensityMap = {
    BAIXA: 0,
    MEDIA: 1,
    ALTA: 2,
  };

  const probabilityMap = {
    IMPROVAVEL: 0,
    PROVAVEL: 1,
    ALTAMENTE_PROVAVEL: 2,
    DEFINITIVA: 3,
  };

  // Risk matrix - rows represent intensity (low to high), columns represent probability (low to high)
  const matrix = [
    [
      'Pouco Significativo',
      'Pouco Significativo',
      'Significativo',
      'Significativo',
    ],
    [
      'Pouco Significativo',
      'Significativo',
      'Significativo',
      'Muito Significativo',
    ],
    [
      'Significativo',
      'Significativo',
      'Muito Significativo',
      'Muito Significativo',
    ],
  ];

  // Update significance when intensity or probability changes
  useEffect(() => {
    if (intensity in intensityMap && probability in probabilityMap) {
      const i = intensityMap[intensity as keyof typeof intensityMap];
      const j = probabilityMap[probability as keyof typeof probabilityMap];
      const newSignificance = matrix[i][j];

      setSignificance(newSignificance);

      if (onChange) {
        onChange(newSignificance);
      }
    }
  }, [intensity, probability, onChange]);

  // Get cell background color based on significance
  const getCellColor = (i: number, j: number) => {
    const cellSignificance = matrix[i][j];

    if (cellSignificance === 'Pouco Significativo') {
      return 'bg-green-100 hover:bg-green-200';
    } else if (cellSignificance === 'Significativo') {
      return 'bg-yellow-100 hover:bg-yellow-200';
    } else {
      return 'bg-red-100 hover:bg-red-200';
    }
  };

  // Get cell border color for active cell
  const getActiveCellStyle = (i: number, j: number) => {
    if (
      intensity in intensityMap &&
      probability in probabilityMap &&
      i === intensityMap[intensity as keyof typeof intensityMap] &&
      j === probabilityMap[probability as keyof typeof probabilityMap]
    ) {
      return 'border-2 border-primary ring-2 ring-primary-light';
    }
    return '';
  };

  return (
    <Card className='w-full'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base'>Matriz de Risco</CardTitle>
        <CardDescription>
          Análise de significância baseada na intensidade e probabilidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col'>
          <div className='flex items-center mb-2'>
            <div className='w-32 font-semibold text-right pr-2'>
              Intensidade / Probabilidade
            </div>
            <div className='grid grid-cols-4 gap-1 flex-1'>
              <div className='text-center text-xs font-medium p-1'>
                Improvável
              </div>
              <div className='text-center text-xs font-medium p-1'>
                Provável
              </div>
              <div className='text-center text-xs font-medium p-1'>
                Altamente Provável
              </div>
              <div className='text-center text-xs font-medium p-1'>
                Definitiva
              </div>
            </div>
          </div>

          {/* Matrix rows */}
          {['Baixa', 'Média', 'Alta'].map((intensityLabel, i) => (
            <div key={i} className='flex items-center mb-1'>
              <div className='w-32 text-xs font-medium text-right pr-2'>
                {intensityLabel}
              </div>
              <div className='grid grid-cols-4 gap-1 flex-1'>
                {[0, 1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className={`text-center text-xs p-2 rounded ${getCellColor(
                      i,
                      j
                    )} ${getActiveCellStyle(i, j)}`}
                  >
                    {matrix[i][j]}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className='flex gap-4 justify-end mt-4'>
            <div className='flex items-center'>
              <div className='w-4 h-4 bg-green-100 rounded mr-1'></div>
              <span className='text-xs'>Pouco Significativo</span>
            </div>
            <div className='flex items-center'>
              <div className='w-4 h-4 bg-yellow-100 rounded mr-1'></div>
              <span className='text-xs'>Significativo</span>
            </div>
            <div className='flex items-center'>
              <div className='w-4 h-4 bg-red-100 rounded mr-1'></div>
              <span className='text-xs'>Muito Significativo</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
