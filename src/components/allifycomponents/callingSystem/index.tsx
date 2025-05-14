


// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { toast, ToastContainer } from 'react-toastify';
// import {
//   fetchAllFacilitatorOrFrontliner,
//   getdashboardReport,
// } from 'services/apiCollection';
// import Reports from '../Reports';
// import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

// type Frontliner = {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   role: string;
// };

// const CallingSystem = () => {
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [report, setReport] = useState<any>(null);

//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [frontlinerRes, dashboardReport] = await Promise.all([
//           fetchAllFacilitatorOrFrontliner(),
//           getdashboardReport(),
//         ]);

//         const filteredFrontliners = frontlinerRes.filter(
//           (item: Frontliner) => item.role === 'frontliner'
//         );
//         setFrontliners(filteredFrontliners);

//         setReport(dashboardReport[0]);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         toast.error('Failed to load data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
//     { accessorKey: 'name', header: 'Name' },
//     {
//       accessorKey: 'phone_number',
//       header: 'Phone Number',
//       Cell: ({ row }) => (
//         <div className="flex space-x-4">
//            <a
//             href={`https://wa.me/${row.original.phone_number}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={(e) => e.stopPropagation()}
//             className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             <FaWhatsapp className="text-lg" />
//             {/* <span className="text-sm md:text-base">WhatsApp</span> */}
//           </a>
//           <a
//             href={`tel:${row.original.phone_number}`}
//             onClick={(e) => e.stopPropagation()}
//             className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             <FaPhoneAlt className="text-lg" />
//             <span className="text-sm md:text-base">{row.original.phone_number}</span>
//           </a>
         
//         </div>
//       ),
//     },
//   ], []);

//   const handleFrontlinerClick = (frontliner: Frontliner) => {
//     router.push(`/admin/dashboard/facilitator-frontliner/${frontliner.user_id}?frontlinerName=${frontliner.name}`);
//   };

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <ToastContainer />
//       <div className="mt-8">
//         <h2 className="mb-5 text-lg font-bold dark:text-white">
//           Dashboard Report
//         </h2>

//         <Reports report={report} />
//         <h2 className="mb-5 text-lg font-bold dark:text-white">
//           Frontliners
//         </h2>
//         <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//           <MaterialReactTable
//             columns={frontlinerColumns}
//             data={frontliners}
//             enableSorting
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: '#312e81',
//                 color: 'white',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 borderRadius: '2px',
//               },
//             }}
//             muiTableBodyRowProps={({ row }) => ({
//               onClick: () => handleFrontlinerClick(row.original),
//               style: { cursor: 'pointer' },
//             })}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default CallingSystem;







'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import {
  getAllFrontlinerReports,
  getdashboardReport,
  getTop3Frontliners,
} from 'services/apiCollection';
import Reports from '../Reports';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

type Frontliner = {
  user_id: number;
  name: string;
  phone_number: string;
  weekly_will_come_student_number:Number;
  weekly_total_registered_student_number:Number;
  total_register:Number;
  total_amount:Number;
  pending_amount:Number;
  role: string;
};

const monthList = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CallingSystem = () => {
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [topFrontliners, setTopFrontliners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => `${currentYear - i}`);
  
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [year, setYear] = useState(`${currentYear}`);
  const router = useRouter();

  const isAdmin = localStorage.getItem('role');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [frontlinerRes, dashboardReport] = await Promise.all([
          getAllFrontlinerReports(),
          getdashboardReport(),
        ]);

       
        setFrontliners(frontlinerRes);

        setReport(dashboardReport[0]);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchTopFrontliners = async () => {
      try {
        setLoading(true);
        const res = await getTop3Frontliners(month, year);
        setTopFrontliners(res);
      } catch (error) {
        console.error('Error fetching top frontliners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopFrontliners();
  }, [month, year, isAdmin]);

  const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'phone_number',
      header: 'Phone Number',
      Cell: ({ row }) => (
        <div className="flex space-x-4">
          <a
            href={`https://wa.me/${row.original.phone_number}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500"
          >
            <FaWhatsapp className="text-lg" />
          </a>
          <a
            href={`tel:${row.original.phone_number}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-2 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
          >
            <FaPhoneAlt className="text-lg" />
            <span className="text-sm md:text-base">{row.original.phone_number}</span>
          </a>
        </div>
      ),
    },
        { accessorKey: 'weekly_will_come_student_number', header: 'Weekly will Come' },
    { accessorKey: 'weekly_total_registered_student_number', header: 'Weekly Total Registered' },
    { accessorKey: 'total_register', header: 'Total Register' },
    { accessorKey: 'total_amount', header: 'Total Amount' },
    { accessorKey: 'pending_amount', header: 'Pending Amount' },

  ], []);

  const handleFrontlinerClick = (frontliner: Frontliner) => {
    router.push(`/admin/dashboard/facilitator-frontliner/${frontliner.user_id}?frontlinerName=${frontliner.name}`);
  };

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="mt-8">
        {isAdmin && (
          <div>
            <h2 className="mb-5 text-lg font-bold dark:text-white">
              Top 3 Frontliners
            </h2>
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900">
              <div className="mb-6 flex items-center justify-end">
                <div className="flex gap-2">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  >
                    {monthList.map((m, index) => (
                      <option key={m} value={m}>
                        {monthNames[index]}
                      </option>
                    ))}
                  </select>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent dark:border-blue-400"></div>
                </div>
              ) : topFrontliners.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No data available for {monthNames[parseInt(month) - 1]} {year}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-900 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100 dark:text-gray-100">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100 dark:text-gray-100">
                          Frontliner Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100 dark:text-gray-100">
                          Online
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100 dark:text-gray-100">
                          Offline
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-100 dark:text-gray-100">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800 dark:divide-gray-700">
                      {topFrontliners.map((frontliner, index) => (
                        <tr key={frontliner.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                index === 0 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : index === 1
                                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                  : index === 2
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {index + 1}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {frontliner.frontliner_name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-gray-900 dark:text-gray-400">
                            {frontliner.total_online_registrations}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-gray-900 dark:text-gray-400">
                            {frontliner.total_offline_registrations}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {frontliner.total_registrations}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <h2 className="mb-5 text-lg font-bold dark:text-white">
          Dashboard Reports
        </h2>
        <Reports report={report} />
        
        <h2 className="mb-5 text-lg font-bold dark:text-white">
          Frontliners
        </h2>
        <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
          <MaterialReactTable
            columns={frontlinerColumns}
            data={frontliners}
            enableSorting
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: '#312e81',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '2px',
              },
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleFrontlinerClick(row.original),
              style: { cursor: 'pointer' },
            })}
          />
        </div>
      </div>
    </>
  );
};

export default CallingSystem;



// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { toast, ToastContainer } from 'react-toastify';
// import {
//   getAllFrontlinerReports,
//   getdashboardReport,
//   getTop3Frontliners,
// } from 'services/apiCollection';
// import Reports from '../Reports';
// import { FaPhoneAlt, FaWhatsapp, FaTrophy, FaChartLine, FaUserFriends } from 'react-icons/fa';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// type Frontliner = {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   weekly_will_come_student_number:Number;
//   weekly_total_registered_student_number:Number;
//   total_register:Number;
//   total_amount:Number;
//   pending_amount:Number;
//   role: string;
// };

// const monthList = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
// const monthNames = [
//   'January', 'February', 'March', 'April', 'May', 'June', 
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const CallingSystem = () => {
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [report, setReport] = useState<any>(null);
//   const [topFrontliners, setTopFrontliners] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 5 }, (_, i) => `${currentYear - i}`);
  
//   const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
//   const [year, setYear] = useState(`${currentYear}`);
//   const router = useRouter();

//   const isAdmin = localStorage.getItem('role');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [frontlinerRes, dashboardReport] = await Promise.all([
//           getAllFrontlinerReports(),
//           getdashboardReport(),
//         ]);

       
//         setFrontliners(frontlinerRes);

//         setReport(dashboardReport[0]);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         toast.error('Failed to load data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!isAdmin) return;

//     const fetchTopFrontliners = async () => {
//       try {
//         setLoading(true);
//         const res = await getTop3Frontliners(month, year);
//         setTopFrontliners(res);
//       } catch (error) {
//         console.error('Error fetching top frontliners:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTopFrontliners();
//   }, [month, year, isAdmin]);

//   const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
//         { accessorKey: 'name', header: 'Name' },
//         {
//           accessorKey: 'phone_number',
//           header: 'Phone Number',
//           Cell: ({ row }) => (
//             <div className="flex space-x-4">
//               <a
//                 href={`https://wa.me/${row.original.phone_number}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500"
//               >
//                 <FaWhatsapp className="text-lg" />
//               </a>
//               <a
//                 href={`tel:${row.original.phone_number}`}
//                 onClick={(e) => e.stopPropagation()}
//                 className="inline-flex items-center space-x-2 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//               >
//                 <FaPhoneAlt className="text-lg" />
//                 <span className="text-sm md:text-base">{row.original.phone_number}</span>
//               </a>
//             </div>
//           ),
//         },
//             { accessorKey: 'weekly_will_come_student_number', header: 'Weekly will Come' },
//         { accessorKey: 'weekly_total_registered_student_number', header: 'Weekly Total Registered' },
//         { accessorKey: 'total_register', header: 'Total Register' },
//         { accessorKey: 'total_amount', header: 'Total Amount' },
//         { accessorKey: 'pending_amount', header: 'Pending Amount' },
    
//       ], []);

//   const handleFrontlinerClick = (frontliner: Frontliner) => {
//     router.push(`/admin/dashboard/facilitator-frontliner/${frontliner.user_id}?frontlinerName=${frontliner.name}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   // Prepare data for the chart
//   const chartData = topFrontliners.map((fl, index) => ({
//     name: fl.name,
//     online: fl.online_registrations,
//     offline: fl.offline_registrations,
//     total: fl.total_registrations,
//     fill: index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : '#f97316'
//   }));

//   return (
//     <>
//       <ToastContainer />
//       <div className="space-y-8 ">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//           <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium">Total Frontliners</p>
//                 <p className="text-3xl font-bold">{frontliners.length}</p>
//               </div>
//               <div className="rounded-full bg-white/20 p-4">
//                 <FaUserFriends className="text-2xl" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 p-6 text-white shadow-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium">Current Month</p>
//                 <p className="text-3xl font-bold">{monthNames[parseInt(month) - 1]} {year}</p>
//               </div>
//               <div className="rounded-full bg-white/20 p-4">
//                 <FaChartLine className="text-2xl" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 p-6 text-white shadow-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium">Top Performer</p>
//                 <p className="text-2xl font-bold">
//                   {topFrontliners[0]?.name || 'N/A'}
//                 </p>
//                 <p className="text-sm">
//                   {topFrontliners[0]?.total_registrations || 0} registrations
//                 </p>
//               </div>
//               <div className="rounded-full bg-white/20 p-4">
//                 <FaTrophy className="text-2xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {isAdmin && (
//           <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
//             <div className="mb-6 flex items-center justify-between">
//               <h2 className="text-xl font-bold text-gray-800 dark:text-white">
//                 <FaTrophy className="mr-2 inline text-amber-500" />
//                 Top 3 Frontliners Performance
//               </h2>
//               <div className="flex gap-2">
//                 <select
//                   value={month}
//                   onChange={(e) => setMonth(e.target.value)}
//                   className="rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 >
//                   {monthList.map((m, index) => (
//                     <option key={m} value={m}>
//                       {monthNames[index]}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   value={year}
//                   onChange={(e) => setYear(e.target.value)}
//                   className="rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 >
//                   {years.map((y) => (
//                     <option key={y} value={y}>
//                       {y}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex h-64 items-center justify-center">
//                 <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
//               </div>
//             ) : topFrontliners.length === 0 ? (
//               <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
//                 No data available for {monthNames[parseInt(month) - 1]} {year}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={chartData}
//                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="online" name="Online" fill="#4f46e5" />
//                       <Bar dataKey="offline" name="Offline" fill="#10b981" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="space-y-4">
//                   {topFrontliners.map((frontliner, index) => (
//                     <div
//                       key={frontliner.user_id}
//                       className="flex items-center rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md dark:border-gray-700"
//                     >
//                       <div
//                         className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white ${
//                           index === 0
//                             ? 'bg-gradient-to-r from-amber-400 to-amber-600'
//                             : index === 1
//                             ? 'bg-gradient-to-r from-gray-400 to-gray-600'
//                             : 'bg-gradient-to-r from-orange-400 to-orange-600'
//                         }`}
//                       >
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-medium text-gray-900 dark:text-white">
//                           {frontliner.name}
//                         </h3>
//                         <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
//                           <span>Online: {frontliner.online_registrations}</span>
//                           <span>Offline: {frontliner.offline_registrations}</span>
//                           <span className="font-semibold text-indigo-600 dark:text-indigo-400">
//                             Total: {frontliner.total_registrations}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
//           <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">
//             <FaChartLine className="mr-2 inline text-indigo-600" />
//             Dashboard Report
//           </h2>
//           <Reports report={report} />
//         </div>

//         <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
//           <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">
//             <FaUserFriends className="mr-2 inline text-green-600" />
//             Frontliners Directory
//           </h2>
//           <MaterialReactTable
//             columns={frontlinerColumns}
//             data={frontliners}
//             enableSorting
//             muiTablePaperProps={{
//               elevation: 0,
//               sx: {
//                 borderRadius: '0.75rem',
//                 boxShadow: 'none',
//                 border: '1px solid #e5e7eb',
//                 overflow: 'hidden',
//               },
//             }}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: 'rgb(49 46 129)',
//                 color: 'white',
//                 fontSize: '0.875rem',
//                 fontWeight: '600',
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.05em',
//               },
//             }}
//             muiTableBodyRowProps={({ row }) => ({
//               onClick: () => handleFrontlinerClick(row.original),
//               sx: {
//                 cursor: 'pointer',
//                 '&:hover': {
//                   backgroundColor: '#f3f4f6',
//                 },
//               },
//             })}
//             muiTableBodyCellProps={{
//               sx: {
//                 borderBottom: '1px solid #e5e7eb',
//               },
//             }}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default CallingSystem;


// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { toast, ToastContainer } from 'react-toastify';
// import {
//   getAllFrontlinerReports,
//   getdashboardReport,
//   getTop3Frontliners,
// } from 'services/apiCollection';
// import Reports from '../Reports';
// import { FaPhoneAlt, FaWhatsapp, FaTrophy, FaChartLine, FaUserFriends } from 'react-icons/fa';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // Type definitions
// interface Frontliner {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   weekly_will_come_student_number: number;
//   weekly_total_registered_student_number: number;
//   total_register: number;
//   total_amount: number;
//   pending_amount: number;
//   role: string;
// }

// interface DashboardReport {
//   total_registered?: number;
//   total_amount?: number;
//   pending_amount?: number;
//   // Add other fields as needed
// }

// interface TopFrontliner {
//   user_id: number;
//   name: string;
//   online_registrations?: number | null;
//   offline_registrations?: number | null;
//   total_registrations?: number | null;
// }

// const monthList = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
// const monthNames = [
//   'January', 'February', 'March', 'April', 'May', 'June', 
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// // Helper function for safe number formatting
// const formatNumber = (num?: number | null) => (num || 0).toLocaleString();

// const CallingSystem = () => {
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [report, setReport] = useState<DashboardReport | null>(null);
//   const [topFrontliners, setTopFrontliners] = useState<TopFrontliner[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 5 }, (_, i) => `${currentYear - i}`);
  
//   const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
//   const [year, setYear] = useState(`${currentYear}`);
//   const router = useRouter();

//   const isAdmin = localStorage.getItem('role');

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const [frontlinerRes, dashboardReport] = await Promise.all([
//         getAllFrontlinerReports(),
//         getdashboardReport(),
//       ]);
    
//       if (!frontlinerRes || !dashboardReport) {
//         throw new Error('Invalid response from server');
//       }

//       setFrontliners(frontlinerRes);
//       setReport(dashboardReport[0] || null);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       toast.error(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchTopFrontliners = async () => {
//     if (!isAdmin) return;

//     try {
//       setLoading(true);
//       const res = await getTop3Frontliners(month, year);
//       setTopFrontliners(res || []);
//     } catch (error) {
//       console.error('Error fetching top frontliners:', error);
//       toast.error('Failed to load top performers data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     fetchTopFrontliners();
//   }, [month, year, isAdmin]);

//   const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
//     { 
//       accessorKey: 'name', 
//       header: 'Name',
//       size: 150
//     },
//     {
//       accessorKey: 'phone_number',
//       header: 'Phone Number',
//       Cell: ({ row }) => (
//         <div className="flex space-x-2">
//           <a
//             href={`https://wa.me/${row.original.phone_number}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={(e) => e.stopPropagation()}
//             className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500"
//             aria-label={`WhatsApp ${row.original.name}`}
//           >
//             <FaWhatsapp className="text-lg" />
//           </a>
//           <a
//             href={`tel:${row.original.phone_number}`}
//             onClick={(e) => e.stopPropagation()}
//             className="inline-flex items-center space-x-2 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//             aria-label={`Call ${row.original.name}`}
//           >
//             <FaPhoneAlt className="text-lg" />
//             <span className="text-sm md:text-base">{row.original.phone_number}</span>
//           </a>
//         </div>
//       ),
//       size: 230
//     },
//     { 
//       accessorKey: 'weekly_will_come_student_number', 
//       header: 'Weekly Will Come',
//       Cell: ({ cell }) => formatNumber(cell.getValue<number>())
//     },
//     { 
//       accessorKey: 'weekly_total_registered_student_number', 
//       header: 'Weekly Registered',
//       Cell: ({ cell }) => formatNumber(cell.getValue<number>())
//     },
//     { 
//       accessorKey: 'total_register', 
//       header: 'Total Register',
//       Cell: ({ cell }) => formatNumber(cell.getValue<number>())
//     },
//     { 
//       accessorKey: 'total_amount', 
//       header: 'Total Amount',
//       Cell: ({ cell }) => `₹${formatNumber(cell.getValue<number>())}`
//     },
//     { 
//       accessorKey: 'pending_amount', 
//       header: 'Pending Amount',
//       Cell: ({ cell }) => (
//         <span className={cell.getValue<number>() > 0 ? 'text-red-600' : 'text-green-600'}>
//           ₹{formatNumber(cell.getValue<number>())}
//         </span>
//       )
//     },
//   ], []);

//   const handleFrontlinerClick = (frontliner: Frontliner) => {
//     router.push(`/admin/dashboard/facilitator-frontliner/${frontliner.user_id}?frontlinerName=${encodeURIComponent(frontliner.name)}`);
//   };

//   // Prepare data for the chart
//   const chartData = topFrontliners.map((fl, index) => ({
//     name: fl.name,
//     online: fl.online_registrations || 0,
//     offline: fl.offline_registrations || 0,
//     total: fl.total_registrations || 0,
//     fill: index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : '#f97316'
//   }));

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={5000} />
//       <div className="space-y-8 ">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//           <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-lg transition-transform hover:scale-[1.02]">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium">Total Frontliners</p>
//                 <p className="text-3xl font-bold">{formatNumber(frontliners.length)}</p>
//               </div>
//               <div className="rounded-full bg-white/20 p-4">
//                 <FaUserFriends className="text-2xl" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 p-6 text-white shadow-lg transition-transform hover:scale-[1.02]">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium">Current Month</p>
//                 <p className="text-3xl font-bold">{monthNames[parseInt(month) - 1]} {year}</p>
//               </div>
//               <div className="rounded-full bg-white/20 p-4">
//                 <FaChartLine className="text-2xl" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 p-6 text-white shadow-lg transition-transform hover:scale-[1.02]">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium">Top Performer</p>
//                 <p className="text-2xl font-bold">
//                   {topFrontliners[0]?.name || 'N/A'}
//                 </p>
//                 <p className="text-sm">
//                   {formatNumber(topFrontliners[0]?.total_registrations)} registrations
//                 </p>
//               </div>
//               <div className="rounded-full bg-white/20 p-4">
//                 <FaTrophy className="text-2xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {isAdmin && (
//           <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
//             <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
//               <h2 className="text-xl font-bold text-gray-800 dark:text-white">
//                 <FaTrophy className="mr-2 inline text-amber-500" />
//                 Top 3 Frontliners Performance
//               </h2>
//               <div className="flex gap-2">
//                 <select
//                   value={month}
//                   onChange={(e) => setMonth(e.target.value)}
//                   className="rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   aria-label="Select month"
//                 >
//                   {monthList.map((m, index) => (
//                     <option key={m} value={m}>
//                       {monthNames[index]}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   value={year}
//                   onChange={(e) => setYear(e.target.value)}
//                   className="rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   aria-label="Select year"
//                 >
//                   {years.map((y) => (
//                     <option key={y} value={y}>
//                       {y}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex h-64 items-center justify-center">
//                 <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
//               </div>
//             ) : topFrontliners.length === 0 ? (
//               <div className="flex h-64 flex-col items-center justify-center text-gray-500 dark:text-gray-400">
//                 <div className="mb-4 text-5xl">📊</div>
//                 <p className="text-lg">No data available for</p>
//                 <p className="font-semibold">
//                   {monthNames[parseInt(month) - 1]} {year}
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={chartData}
//                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                       <XAxis 
//                         dataKey="name" 
//                         tick={{ fill: '#6b7280' }}
//                         axisLine={{ stroke: '#9ca3af' }}
//                       />
//                       <YAxis 
//                         tick={{ fill: '#6b7280' }}
//                         axisLine={{ stroke: '#9ca3af' }}
//                       />
//                       <Tooltip 
//                         contentStyle={{
//                           backgroundColor: '#ffffff',
//                           borderColor: '#e5e7eb',
//                           borderRadius: '0.5rem',
//                           boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
//                         }}
//                       />
//                       <Legend />
//                       <Bar 
//                         dataKey="online" 
//                         name="Online" 
//                         fill="#4f46e5" 
//                         radius={[4, 4, 0, 0]}
//                       />
//                       <Bar 
//                         dataKey="offline" 
//                         name="Offline" 
//                         fill="#10b981" 
//                         radius={[4, 4, 0, 0]}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="space-y-4">
//                   {topFrontliners.map((frontliner, index) => (
//                     <div
//                       key={frontliner.user_id}
//                       className="flex items-center rounded-lg border border-gray-200 p-4 shadow-sm transition-transform hover:scale-[1.01] hover:shadow-md dark:border-gray-700"
//                     >
//                       <div
//                         className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white ${
//                           index === 0
//                             ? 'bg-gradient-to-r from-amber-400 to-amber-600'
//                             : index === 1
//                             ? 'bg-gradient-to-r from-gray-400 to-gray-600'
//                             : 'bg-gradient-to-r from-orange-400 to-orange-600'
//                         }`}
//                       >
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-medium text-gray-900 dark:text-white">
//                           {frontliner.name}
//                         </h3>
//                         <div className="flex flex-wrap justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
//                           <span>Online: {formatNumber(frontliner.online_registrations)}</span>
//                           <span>Offline: {formatNumber(frontliner.offline_registrations)}</span>
//                           <span className="font-semibold text-indigo-600 dark:text-indigo-400">
//                             Total: {formatNumber(frontliner.total_registrations)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
//           <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">
//             <FaChartLine className="mr-2 inline text-indigo-600" />
//             Dashboard Report
//           </h2>
//           <Reports report={report} />
//         </div>

//         <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
//           <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">
//             <FaUserFriends className="mr-2 inline text-green-600" />
//             Frontliners Directory
//           </h2>
//           <MaterialReactTable
//             columns={frontlinerColumns}
//             data={frontliners}
//             enableSorting
//             enableColumnResizing
//             initialState={{ density: 'compact' }}
//             muiTablePaperProps={{
//               elevation: 0,
//               sx: {
//                 borderRadius: '0.75rem',
//                 boxShadow: 'none',
//                 border: '1px solid #e5e7eb',
//                 overflow: 'hidden',
//               },
//             }}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: 'rgb(49 46 129)',
//                 color: 'white',
//                 fontSize: '0.875rem',
//                 fontWeight: '600',
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.05em',
//               },
//             }}
//             muiTableBodyRowProps={({ row }) => ({
//               onClick: () => handleFrontlinerClick(row.original),
//               sx: {
//                 cursor: 'pointer',
//                 '&:hover': {
//                   backgroundColor: '#f3f4f6',
//                 },
//               },
//             })}
//             muiTableBodyCellProps={{
//               sx: {
//                 borderBottom: '1px solid #e5e7eb',
//               },
//             }}
//             displayColumnDefOptions={{
//               'mrt-row-actions': {
//                 header: 'Actions',
//                 size: 100,
//               },
//             }}
//             enableFullScreenToggle={false}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default CallingSystem;