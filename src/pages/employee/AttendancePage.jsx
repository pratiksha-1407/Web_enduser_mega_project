import React, { useState, useEffect } from 'react';
import { checkTodayAttendance, markAttendance, fetchAttendanceHistory } from '../../services/apiAttendance';
import Card from '../../components/ui/Card';
import { MapPin, Clock, Calendar, CheckCircle } from 'lucide-react';

const AttendancePage = () => {
    const [todayStatus, setTodayStatus] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [geoError, setGeoError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const status = await checkTodayAttendance();
        setTodayStatus(status.marked ? status.data : null);

        const historyData = await fetchAttendanceHistory();
        setHistory(historyData);
    };

    const getLocation = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            setGeoError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setGeoError(null);
                handleMarkAttendance(latitude, longitude);
            },
            (error) => {
                setGeoError("Unable to retrieve your location. Please allow access.");
                setLoading(false);
            }
        );
    };

    const handleMarkAttendance = async (lat, long) => {
        const result = await markAttendance({ latitude: lat, longitude: long });
        if (result.success) {
            setTodayStatus(result.data);
            const historyData = await fetchAttendanceHistory();
            setHistory(historyData);
        } else {
            setGeoError("Failed to mark attendance: " + result.error);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>

            {/* Today's Action Card */}
            <Card className="p-8 text-center bg-white shadow-md border-t-4 border-blue-500">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        {todayStatus ? 'Attendance Marked for Today' : 'Mark Your Attendance'}
                    </h2>
                    <p className="text-gray-500">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {todayStatus ? (
                    <div className="inline-flex flex-col items-center p-6 bg-green-50 rounded-full w-48 h-48 justify-center">
                        <CheckCircle size={48} className="text-green-500 mb-2" />
                        <span className="text-2xl font-bold text-green-700">{todayStatus.check_in_time?.slice(0, 5)}</span>
                        <span className="text-sm font-medium text-green-600 uppercase mt-1">{todayStatus.status}</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button
                            onClick={getLocation}
                            disabled={loading}
                            className={`
                                relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all
                                rounded-full shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}
                            `}
                        >
                            {loading ? (
                                <span className="flex items-center"><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div> processing...</span>
                            ) : (
                                <span className="flex items-center"><MapPin className="mr-2" /> Check In Now</span>
                            )}
                        </button>
                        {geoError && <p className="text-red-500 text-sm mt-2">{geoError}</p>}
                        <p className="text-xs text-gray-400">Location access is required to mark attendance.</p>
                    </div>
                )}
            </Card>

            {/* History Table */}
            <h3 className="text-lg font-bold mt-8 mb-4">Recent History</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {history.length > 0 ? (
                            history.map((record) => (
                                <tr key={record.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                        {record.check_in_time?.slice(0, 5)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 truncate max-w-xs">
                                        {record.check_in_location}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No attendance records found for this month.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendancePage;
