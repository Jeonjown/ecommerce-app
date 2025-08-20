import type { OrderResponse } from "@/types/api/orders";
import type { Row } from "@tanstack/react-table";
export const equalsFilterFn = (
  row: Row<OrderResponse>,
  columnId: string,
  filterValue: unknown,
) => {
  if (filterValue === undefined || filterValue === null) return true;

  const cell = row.getValue(columnId);
  if (cell === undefined || cell === null) return false;

  return String(cell).toLowerCase() === String(filterValue).toLowerCase();
};
