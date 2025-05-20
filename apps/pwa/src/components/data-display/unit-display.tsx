export default function UnitDisplay({ unit }: { unit: string }) {
  const parts = unit.match(/(\D+)(\d+)$/);

  if (!parts) return <span>{unit}</span>;

  const [_, base, exponent] = parts;

  return (
    <div className="flex gap-[0px] text-[10px]">
      {base}
      <sup className="text-[8px] ml-0.5 mt-1.5">{exponent}</sup>
    </div>
  );
}
