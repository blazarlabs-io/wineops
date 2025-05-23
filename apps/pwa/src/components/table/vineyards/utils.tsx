import { Vineyard } from "@/models/types/db";

/**
 * Move a file or a folder. This is a pure function, it does not modify the original data.
 * @param files the list of files
 * @param source the file or folder to move
 * @param target the target file or folder to move to
 * @returns the new list of files, or null if the move is invalid
 */
export function shiftGroups(
  items: Vineyard[],
  source: Vineyard,
  target: Vineyard | null | undefined
): Vineyard[] | null {
  if (source === target) {
    return null; // invalid move - no-op
  }

  const sourcePath = source.group; // folder or file to move
  let newParentPath: string[] | undefined; // folder to drop into is where we are going to move the file/folder to

  if (target) {
    newParentPath = target.group;

    console.log(
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
      console.log("\nNewParentPath", source.group);
      newParentPath = pathParent(newParentPath); // if over a file, we take the parent folder
    }
  }

  if (pathStartsWith(newParentPath, sourcePath)) {
    console.log("\nPathStartsWith:", newParentPath, sourcePath);
    return null; // invalid move - we are moving a parent folder into one of its child folders
  }

  console.log("\nXXXXXXXXXXXXXX");

  let splitIndex: number;
  if (target) {
    splitIndex = items.indexOf(target);
    console.log("\nSplitIndex:", splitIndex);
    if (splitIndex > items.indexOf(source)) {
      console.log("\nMoving to the top");
      ++splitIndex; // If we are moving to the top, we move after the target
    }
  } else {
    splitIndex = items.length; // we move at the end
    console.log("\nMoving at the end");
  }

  // All the rows before the split index not starting with the source path
  const rowsBefore = items
    .slice(0, splitIndex)
    .filter((item) => !pathStartsWith(item.group, sourcePath));

  // All the rows starting with the source path, with the path updated
  const rowsMiddle = items
    .filter((item) => pathStartsWith(item.group, sourcePath))
    .map((item) => ({
      ...item,
      group: pathReplaceBase(item.group, sourcePath, newParentPath),
    }));

  // All the rows after the split index not starting with the source path
  const rowsAfter = items
    .slice(splitIndex)
    .filter((item) => !pathStartsWith(item.group, sourcePath));

  console.log("\nROWS:", [...rowsBefore, ...rowsMiddle, ...rowsAfter]);

  // Merge the three parts
  return [...rowsBefore, ...rowsMiddle, ...rowsAfter];
}

/** Get the parent path of a path */
function pathParent(path: string[]): string[] {
  return path.slice(0, -1);
}

/** Check the given path is a subpath or equal to the given base path */
function pathStartsWith(path: string[] | undefined, base: string[]): boolean {
  return (
    !!path &&
    path.length >= base.length &&
    base.every((part, i) => path[i] === part)
  );
}

/** Replace the base of a path. e.g. pathReplaceBase([a,b,c], [a,b], [x,y]) => [x,y,c] */
function pathReplaceBase(
  path: string[],
  oldBase: string[],
  newBase: string[] = []
): string[] {
  return newBase.concat(path.slice(oldBase.length - 1));
}
