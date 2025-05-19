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
import { FaUser } from 'react-icons/fa6';

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
if (isAdmin !== 'admin') return;

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
    //     { accessorKey: 'weekly_will_come_student_number', header: 'Weekly will Come' },
    // { accessorKey: 'weekly_total_registered_student_number', header: 'Weekly Registered' },
    // { accessorKey: 'total_register', header: 'Total Register' },
    // { accessorKey: 'total_amount', header: 'Total Amount' },
    // { accessorKey: 'pending_amount', header: 'Pending Amount' },
    {
  accessorKey: 'weekly_will_come_student_number',
  header: 'Weekly will Come',
  Cell: ({ cell }) => (
    <div className="text-center font-semibold text-black  rounded p-2">
      {cell.getValue<number>()}
    </div>
  ),
  headerClassName: 'text-center',
},
{
  accessorKey: 'weekly_total_registered_student_number',
  header: 'Weekly Registered',
  Cell: ({ cell }) => (
    <div className="text-center font-semibold text-black rounded p-2">
      {cell.getValue<number>()}
    </div>
  ),
  headerClassName: 'text-center',
},
{
  accessorKey: 'total_register',
  header: 'Total Register',
  Cell: ({ cell }) => (
    <div className="text-center font-semibold text-black rounded p-2">
      {cell.getValue<number>()}
    </div>
  ),
  headerClassName: 'text-center',
},
{
  accessorKey: 'total_amount',
  header: 'Total Amount',
  Cell: ({ cell }) => (
    <div className="text-center font-semibold text-green-600 rounded p-2">
      ₹{cell.getValue<number>()}
    </div>
  ),
  headerClassName: 'text-center',
},
{
  accessorKey: 'pending_amount',
  header: 'Pending Amount',
  Cell: ({ cell }) => (
    <div className="text-center font-semibold text-red-500 rounded p-2">
      ₹{cell.getValue<number>()}
    </div>
  ),
  headerClassName: 'text-center',
},


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
        
{isAdmin === 'admin' && (
  <div>
    <h2 className="mb-5 text-lg font-bold dark:text-white">🏅 Top 3 Frontliners</h2>
    <div className="mb-8 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:shadow-gray-900">
      {/* Month & Year Selection */}
      <div className="mb-4 flex items-center justify-end">
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            className="rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loader or Message */}
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent dark:border-blue-400"></div>
        </div>
      ) : topFrontliners.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
                  No data available for {monthNames[parseInt(month) - 1]} {year}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {topFrontliners.slice(0, 3).map((frontliner, index) => {
            const bgGradients = [
              "bg-gradient-to-br from-indigo-500 to-purple-600",
              "bg-gradient-to-br from-blue-500 to-teal-400",
              "bg-gradient-to-br from-amber-500 to-pink-500",
            ];
            const placeLabel = ["🥇 First", "🥈 Second", "🥉 Third"];
            return (
              <div
                key={frontliner.user_id}
                className={`rounded-2xl p-5 text-white shadow-xl transition transform hover:scale-105 ${bgGradients[index]}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-md font-bold bg-white/20 px-3 py-1 rounded-full">
                    {placeLabel[index]}
                  </span>
                  <span className="text-lg font-bold opacity-280">
                    Total: {frontliner.total_registrations}
                  </span>
                </div>

                <div className="text-xl font-semibold mb-1 mt-5 flex items-center gap-2">
                  <FaUser className="text-white/90" />
                  {frontliner.frontliner_name}
                </div>

                <div className="text-md mt-2 opacity-120">
                  🔹 Online: {frontliner.total_online_registrations}
                </div>
                <div className="text-md mt-1 opacity-120">
                  🔸 Offline: {frontliner.total_offline_registrations}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
)}

        <h2 className="mb-5 text-lg font-bold dark:text-white">
          Dashboard Report
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


