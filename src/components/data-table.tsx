import {
  type ColumnVisibilityState,
  flexRender,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getSortedRowModel,
  type LegacyColumnDef,
  useLegacyTable,
} from "@tanstack/react-table/legacy";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from "lucide-react";
import type * as React from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../app/empty-state";
import { cn } from "../lib/cn";
import { Checkbox } from "./checkbox";
import { Skeleton } from "./skeleton";

/** Column definition for `DataTable`, using TanStack Table's v8-compatible shape. */
export type DataTableColumn<TData extends RowData, TValue = unknown> = LegacyColumnDef<
  TData,
  TValue
>;

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData, unknown>[];
  data: TData[];
  /** Unique row id, defaults to array index. */
  getRowId?: (row: TData, index: number) => string;
  isLoading?: boolean;
  /** Rendered instead of rows when `data` is empty and not loading. */
  emptyState?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Enables checkbox row selection; omit for a plain read-only table. */
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (next: RowSelectionState) => void;
  columnVisibility?: ColumnVisibilityState;
  onColumnVisibilityChange?: (next: ColumnVisibilityState) => void;
  sorting?: SortingState;
  onSortingChange?: (next: SortingState) => void;
  /** Called when the user scrolls near the bottom, for "load more" (no pagination UI). */
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  /** Row height estimate in px, used by the virtualizer. */
  estimateRowHeightPx?: number;
  /** Scroll container max height. Defaults to 32rem. */
  maxHeight?: string;
  onRowClick?: (row: TData) => void;
  className?: string;
}

const SELECT_COLUMN_ID = "__select";

/**
 * A dense data table with sorting, checkbox row selection, sticky header, column
 * visibility and virtualized rows (thousands of rows stay fast). Built on
 * TanStack Table + TanStack Virtual.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  isLoading = false,
  emptyState,
  emptyTitle,
  emptyDescription,
  enableRowSelection = false,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  sorting: controlledSorting,
  onSortingChange,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  estimateRowHeightPx = 40,
  maxHeight = "32rem",
  onRowClick,
  className,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<ColumnVisibilityState>(
    {},
  );
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);

  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility;
  const sorting = controlledSorting ?? internalSorting;

  const allColumns: DataTableColumn<TData, unknown>[] = enableRowSelection
    ? [
        {
          id: SELECT_COLUMN_ID,
          header: ({ table }) => (
            <Checkbox
              aria-label={t("dataTable.selectAllRows", "Select all rows")}
              checked={
                table.getIsAllPageRowsSelected()
                  ? true
                  : table.getIsSomePageRowsSelected()
                    ? "indeterminate"
                    : false
              }
              onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              aria-label={t("dataTable.selectRow", "Select row")}
              checked={row.getIsSelected()}
              onCheckedChange={(v) => row.toggleSelected(!!v)}
              onClick={(e) => e.stopPropagation()}
            />
          ),
          enableSorting: false,
          enableHiding: false,
          size: 36,
        },
        ...columns,
      ]
    : columns;

  const table = useLegacyTable({
    data,
    columns: allColumns,
    getRowId,
    state: { rowSelection, columnVisibility, sorting },
    enableRowSelection,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      setInternalRowSelection(next);
      onRowSelectionChange?.(next);
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === "function" ? updater(columnVisibility) : updater;
      setInternalColumnVisibility(next);
      onColumnVisibilityChange?.(next);
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setInternalSorting(next);
      onSortingChange?.(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeightPx,
    overscan: 12,
  });
  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? (virtualRows[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1]?.end ?? 0)
      : 0;

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    if (!onLoadMore || !hasMore || isLoadingMore) return;
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) onLoadMore();
  }

  const leafColumns = table.getVisibleLeafColumns();

  return (
    <div className={cn("rounded-lg border border-border", className)}>
      <div ref={scrollRef} onScroll={handleScroll} className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="h-10 px-3 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 hover:text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDir === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : sortDir === "desc" ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ArrowUpDown className="size-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static loading skeleton
                <tr key={i} className="border-b border-border">
                  {leafColumns.map((col) => (
                    <td key={col.id} className="p-3">
                      <Skeleton className="h-4 w-full max-w-40" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={leafColumns.length} className="p-0">
                  {emptyState ?? (
                    <EmptyState
                      title={emptyTitle ?? t("dataTable.emptyTitle", "Nothing here yet")}
                      description={emptyDescription}
                    />
                  )}
                </td>
              </tr>
            ) : (
              <>
                {paddingTop > 0 && (
                  <tr aria-hidden style={{ height: paddingTop }}>
                    <td colSpan={leafColumns.length} />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  if (!row) return null;
                  const cells = row.getVisibleCells();
                  // The first non-checkbox cell doubles as the row's real, keyboard-reachable
                  // activator (a native <button>), so clicking/tapping/pressing Enter on it works
                  // for mouse, keyboard and screen-reader users alike. The <tr> click stays as a
                  // mouse-only convenience for the rest of the row.
                  const activatorCellId = onRowClick
                    ? cells.find((c) => c.column.id !== SELECT_COLUMN_ID)?.id
                    : undefined;
                  return (
                    <tr
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      onClick={() => onRowClick?.(row.original)}
                      className={cn(
                        "border-b border-border transition-colors hover:bg-muted/50",
                        "data-[state=selected]:bg-accent",
                        onRowClick && "cursor-pointer",
                      )}
                    >
                      {cells.map((cell) => (
                        <td
                          key={cell.id}
                          className="p-3 align-middle [&:has([role=checkbox])]:pr-0"
                        >
                          {cell.id === activatorCellId ? (
                            <button
                              type="button"
                              className="-m-3 block w-[calc(100%+1.5rem)] p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRowClick?.(row.original);
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </button>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr aria-hidden style={{ height: paddingBottom }}>
                    <td colSpan={leafColumns.length} />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
        {isLoadingMore && (
          <div className="flex items-center justify-center gap-2 border-t border-border p-3 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {t("common.loadingMore", "Loading more…")}
          </div>
        )}
      </div>
    </div>
  );
}
