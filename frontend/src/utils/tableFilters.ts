export const equalsFilterFn = (
  row: any,
  columnId: string,
  filterValue: unknown,
) => {
  if (filterValue === undefined || filterValue === null) return true;

  const cell = row.getValue(columnId);
  if (cell === undefined || cell === null) return false;

  return String(cell).toLowerCase() === String(filterValue).toLowerCase();
};
