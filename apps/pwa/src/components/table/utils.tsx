import { DashboardEntity } from "@/models/types/dashboard";

export function shiftGroups<T extends DashboardEntity>(
  items: T[],
  source: T,
  target: T | null | undefined
): T[] | null {
  if (source === target) {
    return null; // invalid move - no-op
  }

  const sourcePath = source.group; // folder or file to move
  let newParentPath: string[] | undefined; // folder to drop into is where we are going to move the file/folder to

  if (target) {
    newParentPath = target.group;

      "\nSource:",
      source,
      "Target:",
      target,
      "SourcePath:",
      sourcePath,
      "NewParentPath:",
      newParentPath,
      "isTargetGroup:",
      target.rowType
    );

    if (target.rowType !== "group") {
      newParentPath = pathParent(newParentPath as string[]); // if over a file, we take the parent folder
    }
  }

  if (pathStartsWith(newParentPath, sourcePath as string[])) {
    return null; // invalid move - we are moving a parent folder into one of its child folders
  }

  let splitIndex: number;
  if (target) {
    splitIndex = items.indexOf(target);
    if (splitIndex > items.indexOf(source)) {
      ++splitIndex; // If we are moving to the top, we move after the target
    }
  } else {
    splitIndex = items.length; // we move at the end
  }

  const rowsBefore = items
    .slice(0, splitIndex)
    .filter((item) => !pathStartsWith(item.group, sourcePath as string[]));

  const rowsMiddle = items
    .filter((item) => pathStartsWith(item.group, sourcePath as string[]))
    .map((item) => ({
      ...item,
      group: pathReplaceBase(
        item.group as string[],
        sourcePath as string[],
        newParentPath
      ),
    }));

  const rowsAfter = items
    .slice(splitIndex)
    .filter((item) => !pathStartsWith(item.group, sourcePath as string[]));

  return [...rowsBefore, ...rowsMiddle, ...rowsAfter];
}

function pathParent(path: string[]): string[] {
  return path.slice(0, -1);
}

function pathStartsWith(path: string[] | undefined, base: string[]): boolean {
  return (
    !!path &&
    path.length >= base.length &&
    base.every((part, i) => path[i] === part)
  );
}

function pathReplaceBase(
  path: string[],
  oldBase: string[],
  newBase: string[] = []
): string[] {
  return newBase.concat(path.slice(oldBase.length - 1));
}
