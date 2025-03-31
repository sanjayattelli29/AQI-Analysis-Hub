
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Database } from "lucide-react";

interface AQIDataTableProps {
  data: any[];
  title?: string;
}

const AQIDataTable: React.FC<AQIDataTableProps> = ({ data, title = "Sample AQI Dataset" }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-blue-300">No data available</div>;
  }

  // Get all unique column keys
  const columns = Object.keys(data[0]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-4 w-4 text-blue-400" />
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
      
      <div className="rounded-md border border-white/10 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/5">
              <TableHead className="text-white w-12 text-center">#</TableHead>
              {columns.map(column => (
                <TableHead key={column} className="text-white">
                  {column.replace('_', ' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className="hover:bg-white/5">
                <TableCell className="text-center font-medium text-blue-300">
                  {index + 1}
                </TableCell>
                {columns.map(column => (
                  <TableCell key={column}>
                    {typeof row[column] === 'number' 
                      ? Number(row[column]).toFixed(2) 
                      : row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AQIDataTable;
