import React, { useEffect, useState } from 'react';
import { fetchEmployeeProfile, fetchEmployeeTargets } from "../services/apiEmployee";
import Card from "../components/ui/Card";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Award } from 'lucide-react';

const UserProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [targets, setTargets] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [profileData, targetData] = await Promise.all([
                fetchEmployeeProfile(),
                fetchEmployeeTargets()
            ]);
            setProfile(profileData);
            setTargets(targetData);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div>Loading profile...</div>;
    if (!profile) return <div>Profile not found</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                        {profile.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                        <p className="text-blue-100 mt-1 flex items-center justify-center md:justify-start gap-2">
                            <Briefcase size={16} /> {profile.position || 'Employee'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur">
                                ID: {profile.emp_id}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm backdrop-blur ${profile.status === 'Active' ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                                {profile.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <User size={20} className="mr-2 text-blue-600" /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem icon={Mail} label="Email Address" value={profile.email} />
                            <InfoItem icon={Phone} label="Phone Number" value={profile.phone || 'N/A'} />
                            <InfoItem icon={MapPin} label="Branch" value={profile.branch || 'N/A'} />
                            <InfoItem icon={MapPin} label="District" value={profile.district || 'N/A'} />
                            <InfoItem icon={Calendar} label="Joining Date" value={new Date(profile.joining_date).toLocaleDateString()} />
                        </div>
                    </Card>
                </div>

                {/* Performance Stats */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <Award size={20} className="mr-2 text-yellow-500" /> Current Month Target
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Achievement</span>
                                    <span className="font-bold">{targets?.achieved_amount || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-500 h-2.5 rounded-full"
                                        style={{ width: `${Math.min(targets?.achieved_amount || 0, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Target</p>
                                    <p className="font-bold text-gray-800">₹{(targets?.target_amount || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Achieved</p>
                                    <p className="font-bold text-green-600">₹{(targets?.achieved_amount || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start p-3 bg-gray-50 rounded-lg">
        <Icon size={20} className="text-gray-400 mt-0.5 mr-3" />
        <div>
            <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
            <p className="text-gray-900 font-medium">{value}</p>
        </div>
    </div>
);

export default UserProfilePage;
