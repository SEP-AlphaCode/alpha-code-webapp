import { Action } from "@/types/action"
import { columns} from "./columns"
import { DataTable } from "@/components/ui/data-table"

async function getData(): Promise<Action[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "hhhSample Action",
      description: "This is a sample action.",
      duration: 60,
      status: 1,
      createDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      canInterrupt: true,
    },
    {
      id: "728ed52f",
      name: "dsdsdsgsdSample Action",
      description: "This is a sample action.",
      duration: 60,
      status: 1,
      createDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      canInterrupt: true,
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}