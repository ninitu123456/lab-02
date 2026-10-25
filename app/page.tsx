
import DataGrid from "@/components/data-grid/DataGrid";
import { employees, type Employee } from "@/data/employees";
import type { ColumnDef } from "@/types/data-grid-contract";

const columns: ColumnDef<Employee>[] = [
  { header: "ID", accessorKey: "id", sortable: true },
  { header: "Name", accessorKey: "name", sortable: true },
  { header: "Department", accessorKey: "department", sortable: true },
  { header: "Position", accessorKey: "position", sortable: true },
  { header: "Salary (USD)", accessorKey: "salary", sortable: true },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="font-semibold text-blue-800">
            Advanced Web Development · Homework 1
          </p>
          <h1 className="text-3xl font-bold text-slate-950">
            Enterprise Data Grid
          </h1>
          <p className="text-slate-700">
            Accessible employee management table with sorting,
            filtering, pagination, and keyboard navigation.
          </p>
        </header>

        <DataGrid<Employee>
          data={employees}
          columns={columns}
          ariaLabel="Employee management data grid"
        />
      </div>
    </main>
  );
}
