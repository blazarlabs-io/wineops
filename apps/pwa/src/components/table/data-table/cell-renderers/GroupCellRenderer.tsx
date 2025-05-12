import CertificationsDataDisplay from "@/components/data-display/certifications-data-display";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

export const GroupCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
  value,
}) => {
  // if (node.treeNode.children) {
  // console.log('node', node.treeNode.children);

  // console.log('OBJECT:', Object.fromEntries(node.treeNode.children));

  // Object.keys(node.treeNode.children).map((key) => {
  //   console.log('key', key);
  // });
  // }
  // if (node.group && node.treeNode && node.treeNode.children) {
  //   const childKeys = node.treeNode?.children?.map((child: any) => child.treeNode.key);
  //   console.log('childKeys', childKeys);
  // }

  /*
 if the group has vineyards, iterate overthem and extract the cadastral number
*/

  return (
    <div className="flex items-start justify-center flex-col gap-2">
      {typeof value === "string" ? (
        <div className="flex flex-col gap-2">
          <p className="">{value}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="leading-[1]">{value[value.length - 1]}</p>
          {node.data && (
            <p className="text-xs text-muted-foreground leading-[1]">
              {node.data.cadastralNumber || "Cadastral Number N/A"}
            </p>
          )}
        </div>
      )}
      {node.data && node.data.info && node.data.info.certifications ? (
        <CertificationsDataDisplay
          certifications={node.data.info.certifications}
        />
      ) : (
        <CertificationsDataDisplay
          certifications={{
            eco: { active: false, fileUrl: "" },
            igp: { active: false, fileUrl: "" },
            dop: { active: false, fileUrl: "" },
          }}
        />
      )}
    </div>
  );
};
