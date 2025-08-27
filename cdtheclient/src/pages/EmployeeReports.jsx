import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const EmployeeReports = () => {
  const reports = [
    { id: 1, name: 'Daily Sales', period: 'Today', lastGenerated: '2 hours ago' },
    { id: 2, name: 'Weekly Orders', period: 'This Week', lastGenerated: '1 day ago' },
    { id: 3, name: 'Customer Feedback', period: 'Monthly', lastGenerated: '3 days ago' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Reports</Typography>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report Name</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Last Generated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map(report => (
              <TableRow key={report.id}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.period}</TableCell>
                <TableCell>{report.lastGenerated}</TableCell>
                <TableCell>
                  <button className="text-blue-500 hover:text-blue-700 mr-2">View</button>
                  <button className="text-green-500 hover:text-green-700">Download</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeReports;