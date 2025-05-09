import type { CustomCellRendererProps } from 'ag-grid-react';
import { type FunctionComponent } from 'react';

export const GrapeVarietyCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
  data,
  node,
}) => {
  //   console.log('value', value);
  //   console.log('data', data);
  console.log('node', value, node);

  return <>{value && <div className="flex items-center w-full h-full">{value}</div>}</>;
};
