import { cn } from '@repo/ui/lib/utils';
import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface LabSingleItemDataDisplayProps {
  name: string;
  value: string;
  unit: string;
  variation: string;
}

export default function LabSingleItemDataDisplay({
  name,
  value,
  unit,
  variation,
}: LabSingleItemDataDisplayProps) {
  const [isVariationPositive, setIsVariationPositive] = useState<boolean>(true);
  const mountRef = useRef<boolean>(false);

  useEffect(() => {
    if (!mountRef.current && variation.charAt(0) === '-') {
      setIsVariationPositive(false);
      mountRef.current = true;
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center max-h-fit gap-1">
        <div className="w-1 h-3 bg-primary" />
        <div>
          <p className="text-muted-foreground">{name}</p>
        </div>
        <div
          className={cn(
            'max-h-fit mt-[-8px] flex gap-1',
            isVariationPositive ? 'text-[#00C950]' : 'text-[#FF7878]'
          )}
        >
          {isVariationPositive ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowUp className="w-3 h-3 rotate-180" />
          )}
          <span className="text-[10px]">{variation}</span>
          <div className="flex gap-[1px]">
            <span className="text-[10px]">{unit.slice(0, unit.length - 1)}</span>
            <span className="text-[10px] mt-[-3px]">{unit.charAt(unit.length - 1)}</span>
          </div>
        </div>
      </div>
      <div>
        <div className="max-h-fit mt-[-16px] flex items-center gap-2">
          <span className="text-sm">{value}</span>
          <div className="flex gap-1">
            <span className="text-sm">{unit.slice(0, unit.length - 1)}</span>
            <span className="text-[10px]">{unit.charAt(unit.length - 1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
