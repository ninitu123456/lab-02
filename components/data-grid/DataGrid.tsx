
"use client";

import {
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type {
  ColumnDef,
  DataGridProps,
} from "@/types/data-grid-contract";

type SortDirection = "asc" | "desc";

export default function DataGrid<T extends object>({
  data,
  columns,
  onRowSelect,
  ariaLabel,
}: DataGridProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [activeCell, setActiveCell] = useState<[number, number]>([0, 0]);
  const [status, setStatus] = useState("");

  const pageSize = 5;
  const cellRefs = useRef<Map<string, HTMLTableCellElement>>(new Map());

  const filteredData = useMemo(() => {
    const search = query.trim().toLowerCase();

    return data.filter((item) =>
      columns.some((column) =>
        String(item[column.accessorKey] ?? "")
          .toLowerCase()
          .includes(search)
      )
    );
  }, [data, columns, query]);

  const sortedData = useMemo(() => {
    if (sortKey === null) return filteredData;

    return [...filteredData].sort((a, b) => {
      const first = a[sortKey];
      const second = b[sortKey];

      const comparison =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first ?? "").localeCompare(String(second ?? ""), undefined, {
              numeric: true,
              sensitivity: "base",
            });

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageData = sortedData.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

  

  function handleSort(column: ColumnDef<T>) {
    if (!column.sortable) return;

    if (sortKey === column.accessorKey) {
      setSortDirection((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(column.accessorKey);
      setSortDirection("asc");
    }

    setPage(1);
    setActiveCell([0, 0]);
  }

  function toggleRow(item: T) {
    const selected = selectedRows.includes(item);

    setSelectedRows((previous) =>
      selected
        ? previous.filter((row) => row !== item)
        : [...previous, item]
    );

    setStatus(selected ? "Row deselected" : "Row selected");
    onRowSelect?.(item);
  }

  function moveFocus(row: number, column: number) {
    const nextRow = Math.max(0, Math.min(row, pageData.length - 1));
    const nextColumn = Math.max(0, Math.min(column, columns.length - 1));

    setActiveCell([nextRow, nextColumn]);

    cellRefs.current.get(`${nextRow}-${nextColumn}`)?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTableCellElement>,
    row: number,
    column: number,
    item: T
  ) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveFocus(row + 1, column);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(row - 1, column);
        break;
      case "ArrowRight":
        event.preventDefault();
        moveFocus(row, column + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(row, column - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        toggleRow(item);
        break;
      case "Home":
        event.preventDefault();
        moveFocus(row, 0);
        break;
      case "End":
        event.preventDefault();
        moveFocus(row, columns.length - 1);
        break;
    }
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    setActiveCell([0, 0]);
    cellRefs.current.clear();
    setStatus(`Page ${nextPage} of ${totalPages}`);
  }

  return (
    <section className="space-y-5" aria-label={ariaLabel}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label
            htmlFor="grid-search"
            className="mb-2 block font-semibold text-slate-900"
          >
            Search employees
          </label>
          <input
            id="grid-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
              setActiveCell([0, 0]);
            }}
            placeholder="Search all columns..."
            className="rounded-lg border border-slate-500 bg-white px-4 py-2 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          />
        </div>

        <p className="text-sm font-medium text-slate-800">
          {filteredData.length} results · {selectedRows.length} selected
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-300">
        <table
          role="grid"
          aria-label={ariaLabel}
          aria-multiselectable="true"
          aria-rowcount={sortedData.length + 1}
          aria-colcount={columns.length}
          className="w-full border-collapse bg-white text-left text-slate-950"
        >
          <thead className="bg-slate-100">
            <tr role="row">
              {columns.map((column) => (
                <th
                  key={String(column.accessorKey)}
                  scope="col"
                  role="columnheader"
                  aria-sort={
                    sortKey === column.accessorKey
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="border-b border-slate-300 px-4 py-3"
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      className="rounded font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      {column.header}
                      {sortKey === column.accessorKey
                        ? sortDirection === "asc"
                          ? " ↑"
                          : " ↓"
                        : " ↕"}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageData.length === 0 ? (
              <tr role="row">
                <td
                  role="gridcell"
                  colSpan={columns.length}
                  className="px-4 py-8 text-center"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              pageData.map((item, rowIndex) => {
                const selected = selectedRows.includes(item);

                return (
                  <tr
                    key={(page - 1) * pageSize + rowIndex}
                    role="row"
                    aria-selected={selected}
                    className={selected ? "bg-blue-100" : "hover:bg-slate-50"}
                  >
                    {columns.map((column, columnIndex) => (
                      <td
                        key={String(column.accessorKey)}
                        role="gridcell"
                        aria-colindex={columnIndex + 1}
                        aria-rowindex={
                          (page - 1) * pageSize + rowIndex + 2
                        }
                        ref={(element) => {
                          const key = `${rowIndex}-${columnIndex}`;
                          if (element) cellRefs.current.set(key, element);
                          else cellRefs.current.delete(key);
                        }}
                        tabIndex={
                          activeCell[0] === rowIndex &&
                          activeCell[1] === columnIndex
                            ? 0
                            : -1
                        }
                        onFocus={() =>
                          setActiveCell([rowIndex, columnIndex])
                        }
                        onKeyDown={(event) =>
                          handleKeyDown(
                            event,
                            rowIndex,
                            columnIndex,
                            item
                          )
                        }
                        onClick={() => toggleRow(item)}
                        className="cursor-pointer border-b border-slate-200 px-4 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700"
                      >
                        {String(item[column.accessorKey] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-800">
          Page {page} of {totalPages}
        </p>

        <nav aria-label="Data grid pagination" className="flex gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
            className="rounded-lg border border-slate-500 px-4 py-2 text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => changePage(page + 1)}
            className="rounded-lg border border-slate-500 px-4 py-2 text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Next
          </button>
        </nav>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      <p className="text-sm text-slate-700">
        Keyboard: Arrow keys navigate cells. Enter or Space toggles row
        selection. Home and End move to the first and last cell.
      </p>
    </section>
  );
}
