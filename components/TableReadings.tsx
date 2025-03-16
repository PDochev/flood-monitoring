import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableDataProps } from "@/lib/definitions";

const renderTable = ({
  tableData,
  hasStageData,
  hasDownstreamData,
}: TableDataProps) => (
  <div className="overflow-x-auto">
    <Table>
      <TableCaption>Hourly water level readings (m)</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Time</TableHead>
          {hasStageData && <TableHead>Stage (m)</TableHead>}
          {hasDownstreamData && <TableHead>Downstream (m)</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((reading) => (
          <TableRow key={reading.dateTime}>
            <TableCell className="font-medium">{reading.time}</TableCell>
            {hasStageData && (
              <TableCell>
                {reading.stage !== undefined ? reading.stage.toFixed(3) : "-"}
              </TableCell>
            )}
            {hasDownstreamData && (
              <TableCell>
                {reading.downstream !== undefined
                  ? reading.downstream.toFixed(3)
                  : "-"}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default renderTable;
