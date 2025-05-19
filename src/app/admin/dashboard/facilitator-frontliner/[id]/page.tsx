// 'use client';

// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { toast, ToastContainer } from 'react-toastify';
// import {
//   fetchAllFacilitatorOrFrontliner,
//   updateCallingId,
//   getFrontlinerReport,
//   frontlinerStudentByIdOfcallingId,
//   frontlinerStudentById,
// } from 'services/apiCollection';
// import { FaCheckCircle, FaPhoneAlt, FaTimesCircle } from 'react-icons/fa';
// import { Autocomplete, TextField } from '@mui/material';
// import ResponseModal from 'components/allifycomponents/callingSystem/ResponseModal';
// import PaymentStatus from 'components/allifycomponents/callingSystem/PaymentStatus';
// import Reports from 'components/allifycomponents/Reports';
// import { FaWhatsapp } from 'react-icons/fa6';

// interface Student {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   payment_mode: string;
//   registration_date: string;
//   student_status: string;
//   student_status_date: string;
//   profession: string;
//   payment_status: string;
// }

// interface Frontliner {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   role: string;
// }

// const FrontlinerCallingPage = () => {
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [allfrontlinerStudents, setAllFrontlinerStudents] = useState<Student[]>([]);
//   const [callingStudents, setCallingStudents] = useState<Student[]>([]);
//   const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [responseModalOpen, setResponseModalOpen] = useState(false);
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [selectedFrontliner, setSelectedFrontliner] = useState<Frontliner | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showCallingTable, setShowCallingTable] = useState(false);

//   const { id: frontlinerId } = useParams();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const frontlinerName = searchParams.get('frontlinerName');

//   const fetchData = useCallback(async () => {
//     if (!frontlinerId) return;
//     setIsLoading(true);
//     try {
//       const [frontlinerRes, reportRes, allstudentRes] = await Promise.all([
//         fetchAllFacilitatorOrFrontliner(),
//         getFrontlinerReport(frontlinerId),
//         frontlinerStudentById(frontlinerId),
//       ]);
//       setFrontliners(frontlinerRes);
//       setFrontlinerReport(reportRes[0]);
//       setAllFrontlinerStudents(allstudentRes.users);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       toast.error('Failed to load data');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [frontlinerId]);

//   useEffect(() => {
//     if (frontlinerId) fetchData();
//   }, [frontlinerId, fetchData]);

//   const refreshStudentAndReport = useCallback(async () => {
//     if (!frontlinerId) return;
//     try {
//       const [allstudentRes, reportRes] = await Promise.all([
//         frontlinerStudentById(frontlinerId),
//         getFrontlinerReport(frontlinerId),
//       ]);
//       setAllFrontlinerStudents(allstudentRes.users);
//       setFrontlinerReport(reportRes[0]);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to refresh data');
//     }
//   }, [frontlinerId]);

//   const refreshStudentAndReports = useCallback(async () => {
//     if (!frontlinerId) return;
//     try {
//       const [allstudentResss, reportRes] = await Promise.all([
//         frontlinerStudentByIdOfcallingId(frontlinerId),
//         getFrontlinerReport(frontlinerId),
//       ]);
//       setCallingStudents(allstudentResss.data);
//       setFrontlinerReport(reportRes[0]);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to refresh data');
//     }
//   }, [frontlinerId]);

//   const handleToggle = useCallback(
//     async (e: React.ChangeEvent<HTMLInputElement>) => {
//       const isChecked = e.target.checked;
//       setShowCallingTable(isChecked);

//       if (isChecked && frontlinerId) {
//         setIsLoading(true);
//         try {
//           const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
//           setCallingStudents(res.data);
//         } catch (err) {
//           console.error(err);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     },
//     [frontlinerId],
//   );

//   const handleAssign = useCallback(async () => {
//     if (!selectedFrontliner) {
//       toast.error('Please select a frontliner');
//       return;
//     }
//     const selectedUserIds = callingStudents
//       .filter((row) => rowSelection[row.user_id.toString()])
//       .map((row) => row.user_id);

//     if (!selectedUserIds.length) {
//       toast.error('Please select at least one student');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await updateCallingId(selectedUserIds, String(selectedFrontliner.user_id));
//       toast.success('Calling ID assigned successfully!');
//       await refreshStudentAndReport();
//       if (frontlinerId) {
//         const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
//         setCallingStudents(res.data);
//       }
//       setRowSelection({});
//     } catch (err) {
//       console.error(err);
//       window.location.reload();
//       // toast.error('Failed to assign calling ID');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [callingStudents, rowSelection, selectedFrontliner, refreshStudentAndReport, frontlinerId]);

//   const allstudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name', size: 180 },
//       { accessorKey: 'payment_mode', header: 'Payment Mode', size: 80 },
//       {
//         accessorKey: 'registration_date',
//         header: 'Registration Date',
//         size: 180,
//         Cell: ({ cell }) => {
//           const raw = cell.getValue<string>();
//           const date = new Date(raw);
//           const formatted = date.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'long',
//             year: 'numeric',
//           });
//           return <span>{formatted}</span>;
//         },
//       },
//       {
//         accessorKey: 'payment_status',
//         header: 'Payment Status',
//         size: 150,
//         Cell: ({ row, cell }) => {
//           const value = cell.getValue<string>();
//           const user = row.original;
//           const paymentStatusMap: Record<string, string> = {
//             received: 'Received',
//             not_received: 'Not Received',
//           };

//           const handleClick = () => {
//             if (value === 'not_received') {
//               setSelectedRow(user);
//               setPaymentModalOpen(true);
//             }
//           };

//           return (
//             <span
//               onClick={handleClick}
//               style={{
//                 color: value === 'received' ? 'green' : 'red',
//                 fontWeight: 'bold',
//                 cursor: value === 'not_received' ? 'pointer' : 'default',
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//             >
//               {value === 'received' ? (
//                 <FaCheckCircle style={{ marginRight: '8px' }} />
//               ) : (
//                 <FaTimesCircle style={{ marginRight: '8px' }} />
//               )}
//               {paymentStatusMap[value] || value}
//             </span>
//           );
//         },
//       },
//       // {
//       //   accessorKey: 'mobile_number',
//       //   header: 'Phone Number',
//       //   size: 80,
//       //   Cell: ({ row }) => (
//       //     <a
//       //       href={`tel:${row.original.mobile_number}`}
//       //       className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//       //     >
//       //       <FaPhoneAlt className="text-xl" />
//       //       <span className="text-sm md:text-base">{row.original.mobile_number}</span>
//       //     </a>
//       //   ),
//       // },
//       {
//         accessorKey: 'phone_number',
//         header: 'Phone Number',
//         Cell: ({ row }) => (
//           <div className="flex space-x-4">
//              <a
//               href={`https://wa.me/${row.original.mobile_number}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               onClick={(e) => e.stopPropagation()}
//               className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
//             >
//               <FaWhatsapp className="text-lg" />
//               {/* <span className="text-sm md:text-base">WhatsApp</span> */}
//             </a>
//             <a
//               href={`tel:${row.original.mobile_number}`}
//               onClick={(e) => e.stopPropagation()}
//               className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
//             >
//               <FaPhoneAlt className="text-lg" />
//               <span className="text-sm md:text-base">{row.original.mobile_number}</span>
//             </a>

//           </div>
//         ),
//       },
//     ],
//     [],
//   );

//   const callingStudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name' },
//       {
//         accessorKey: 'profession',
//         header: 'Profession',
//         Cell: ({ cell }) => {
//           const value = cell.getValue<string>();
//           const formatted = value
//             .split('_')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(' ');
//           return formatted;
//         },
//       },
//       {
//         accessorKey: 'student_status',
//         header: 'Student Status',
//         Cell: ({ cell }) => {
//           const value = cell.getValue<string>();
//           const statusMap: Record<string, string> = {
//             will_come: 'Will Come',
//             not_interested: 'Not Interested',
//             busy: 'Busy',
//             might_come: 'Might Come',
//           };
//           return <span>{statusMap[value] || value}</span>;
//         },
//       },
//       // {
//       //   accessorKey: 'student_status_date',
//       //   header: 'Last Calling Date',
//       //   Cell: ({ cell }) => {
//       //     const raw = cell.getValue<string>();
//       //     const date = new Date(raw);
//       //     const formatted = date.toLocaleDateString('en-GB', {
//       //       day: '2-digit',
//       //       month: 'long',
//       //       year: 'numeric',
//       //     });
//       //     return <span>{formatted}</span>;
//       //   },
//       // },
//       {
//         accessorKey: 'student_status_date',
//         header: 'Last Calling Date',
//         Cell: ({ cell }) => {
//           const raw = cell.getValue<string>();
//           if (!raw) return null; // If null, don't display anything
//           const date = new Date(raw);
//           const formatted = date.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'long',
//             year: 'numeric',
//           });
//           return <span>{formatted}</span>;
//         },
//       },

//       {
//         accessorKey: 'response',
//         header: 'Calling Response',
//         Cell: ({ row }) => (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedRow(row.original);
//               setResponseModalOpen(true);
//             }}
//             className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
//           >
//             Response
//           </button>
//         ),
//       },
//       // {
//       //   accessorKey: 'mobile_number',
//       //   header: 'Phone Number',
//       //   size: 80,
//       //   Cell: ({ row }) => (
//       //     <a
//       //       href={`tel:${row.original.mobile_number}`}
//       //       className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//       //     >
//       //       <FaPhoneAlt className="text-xl" />
//       //       <span className="text-sm md:text-base">{row.original.mobile_number}</span>
//       //     </a>
//       //   ),
//       // },

//        {
//         accessorKey: 'phone_number',
//         header: 'Phone Number',
//         Cell: ({ row }) => (
//           <div className="flex space-x-4">
//              <a
//               href={`https://wa.me/${row.original.mobile_number}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               onClick={(e) => e.stopPropagation()}
//               className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
//             >
//               <FaWhatsapp className="text-lg" />
//               {/* <span className="text-sm md:text-base">WhatsApp</span> */}
//             </a>
//             <a
//               href={`tel:${row.original.mobile_number}`}
//               onClick={(e) => e.stopPropagation()}
//               className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
//             >
//               <FaPhoneAlt className="text-lg" />
//               <span className="text-sm md:text-base">{row.original.mobile_number}</span>
//             </a>

//           </div>
//         ),
//       },
//     ],
//     [],
//   );

//   return (
//     <>
//     <ToastContainer/>
//     <div className="mt-8">
//       <div className="mb-6 flex justify-end">
//         <button
//           onClick={() => router.back()}
//           className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
//         >
//           ← Back
//         </button>
//       </div>

//       <h2 className="mb-5 text-lg font-bold dark:text-white">Frontliner {frontlinerName} Report</h2>
//       <Reports report={frontlinerReport} />

//       <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
//         <div className="mb-4 mt-1 flex justify-end">
//           <label className="inline-flex cursor-pointer items-center">
//             <input
//               type="checkbox"
//               className="peer sr-only"
//               onChange={handleToggle}
//             />
//             <div
//               className="peer relative h-7 w-14 rounded-full bg-gray-200
//                 after:absolute after:start-[4px] after:top-0.5 after:h-6
//                 after:w-6 after:rounded-full after:border after:border-gray-300
//                 after:bg-white after:transition-all after:content-['']
//                 peer-checked:bg-blue-900 peer-checked:after:translate-x-full
//                 peer-checked:after:border-white peer-focus:outline-none
//                 peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600
//                 dark:bg-gray-700 dark:peer-checked:bg-blue-900
//                 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"
//             />
//           </label>
//         </div>

//         {!showCallingTable ? (
//           <>
//                 <h2 className="mb-5 text-lg font-bold ">Frontliner {frontlinerName} Registration</h2>
//                 <MaterialReactTable
//                   columns={allstudentColumns}
//                   data={allfrontlinerStudents}
//                   enableSorting
//                   onRowSelectionChange={setRowSelection}
//                   state={{ rowSelection }}
//                   getRowId={(row) => row.user_id.toString()}
//                   muiTableHeadCellProps={{
//                     sx: {
//                       backgroundColor: '#312e81',
//                       color: 'white',
//                       fontSize: '16px',
//                       fontWeight: 'bold',
//                       borderRadius: '2px',
//                     },
//                   }}
//                 />
//           </>
//         ) : (
//           <>
//                           <h2 className="mb-5 text-lg font-bold ">Frontliner {frontlinerName} Assigned Calling

// </h2>
//             <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
//               <Autocomplete
//                 id="frontliner-select"
//                 options={frontliners.filter(
//                   (f) => String(f.user_id) !== String(frontlinerId),
//                 )}
//                 loading={isLoading}
//                 getOptionLabel={(option) =>
//                   `${option.user_id} - ${option.name} (${option.role})`
//                 }
//                 onChange={(_, newValue) => setSelectedFrontliner(newValue)}
//                 className="w-full md:flex-grow"
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Frontliner and Facilitator"
//                     placeholder="Search..."
//                     fullWidth
//                   />
//                 )}
//               />
//               <button
//                 type="button"
//                 onClick={handleAssign}
//                 className="mt-4 rounded-lg bg-indigo-900 px-8 py-3.5 text-lg text-white hover:bg-indigo-800 md:ml-2 md:mt-0"
//               >
//                 {isLoading ? 'Assigning...' : 'Assign'}
//               </button>
//             </div>

//             <MaterialReactTable
//               columns={callingStudentColumns}
//               data={callingStudents}
//               enableSorting
//               enableRowSelection
//               onRowSelectionChange={setRowSelection}
//               state={{ rowSelection }}
//               getRowId={(row) => row.user_id.toString()}
//               muiTableHeadCellProps={{
//                 sx: {
//                   backgroundColor: '#312e81',
//                   color: 'white',
//                   fontSize: '16px',
//                   fontWeight: 'bold',
//                   borderRadius: '2px',
//                 },
//               }}
//             />
//           </>
//         )}
//       </div>

//       <PaymentStatus
//         isOpens={paymentModalOpen}
//         closeModal={() => setPaymentModalOpen(false)}
//         selectedRow={selectedRow}
//         onSuccess={refreshStudentAndReport}
//       />

//       <ResponseModal
//         isOpen={responseModalOpen}
//         closeModal={() => setResponseModalOpen(false)}
//         selectedRow={selectedRow}
//         onSuccess={refreshStudentAndReports}
//       />
//     </div>
//     </>
//   );
// };

// export default FrontlinerCallingPage;

// 'use client';

// import React, { useCallback, useEffect, useState } from 'react';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import { toast, ToastContainer } from 'react-toastify';
// import {
//   getFrontlinerReport,
// } from 'services/apiCollection';
// import Reports from 'components/allifycomponents/Reports';

// const FrontlinerCallingPage = () => {

//   const [frontlinerReport, setFrontlinerReport] = useState<any>(null);

//   const [isLoading, setIsLoading] = useState(false);

//   const { id: frontlinerId } = useParams();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const frontlinerName = searchParams.get('frontlinerName');

//   const fetchData = useCallback(async () => {
//     if (!frontlinerId) return;
//     setIsLoading(true);
//     try {
//       const [reportRes] = await Promise.all([
//         getFrontlinerReport(frontlinerId),
//       ]);
//       setFrontlinerReport(reportRes[0]);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       toast.error('Failed to load data');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [frontlinerId]);

//   useEffect(() => {
//     if (frontlinerId) fetchData();
//   }, [frontlinerId, fetchData]);

//   return (
//     <>
//     <ToastContainer/>
//     <div className="mt-8">
//       <div className="mb-6 flex justify-end">
//         <button
//           onClick={() => router.back()}
//           className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
//         >
//           ← Back
//         </button>
//       </div>

//       <h2 className="mb-5 text-lg font-bold dark:text-white">Frontliner {frontlinerName} Report</h2>
//       <Reports report={frontlinerReport} />

//       <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
//         dfrgr
//       </div>
//     </div>
//     </>
//   );
// };

// export default FrontlinerCallingPage;

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { getFrontlinerReport } from 'services/apiCollection';
import Reports from 'components/allifycomponents/Reports';

const FrontlinerCallingPage = () => {
  const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const { id: frontlinerId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const frontlinerName = searchParams.get('frontlinerName');

  const fetchData = useCallback(async () => {
    if (!frontlinerId) return;
    setIsFetchingData(true);
    try {
      const [reportRes] = await Promise.all([
        getFrontlinerReport(frontlinerId),
      ]);
      setFrontlinerReport(reportRes[0]);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setIsFetchingData(false);
    }
  }, [frontlinerId]);

  useEffect(() => {
    if (frontlinerId) fetchData();
  }, [frontlinerId, fetchData]);

  const navigateToRegistration = () => {
    setIsLoading(true);
    router.push(
      `/admin/frontliner-registration/${frontlinerId}?frontlinerName=${frontlinerName}`,
    );
  };

  const navigateToAssignedCalling = () => {
    setIsLoading(true);
    router.push(
      `/admin/frontliner-calling/${frontlinerId}?frontlinerName=${frontlinerName}`,
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="mt-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? <>Loading.......</> : '← Back'}
          </button>
        </div>

        <h2 className="mb-5 text-lg font-bold dark:text-white">
          Frontliner {frontlinerName} Report
        </h2>

        {isFetchingData ? (
          <div className="flex justify-center py-10">Loading.......</div>
        ) : (
          <>
            <Reports report={frontlinerReport} />
            {/* Two colorful cards */}
            <h2 className="mb-5 mt-10 text-lg font-bold dark:text-white">
          Frontliner {frontlinerName} Registration Report & Assigned Calling Report
        </h2>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div
                onClick={navigateToRegistration}
                className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Frontliner {frontlinerName} Registration Report  
                </h3>
                <p className="text-blue-100">
                  Click to view registration details and information
                </p>
              </div>

              <div
                onClick={navigateToAssignedCalling}
                className="cursor-pointer rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Frontliner {frontlinerName} Assigned Calling Report  
                </h3>
                <p className="text-green-100">
                  Click to view assigned callings and reports
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FrontlinerCallingPage;
