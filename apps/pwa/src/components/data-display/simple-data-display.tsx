export type SimpleDataDisplayProps = {
  label: string;
  value: string;
};

export default function SimpleDataDisplay({ label, value }: SimpleDataDisplayProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
