import React, { useState, useEffect } from 'react';
import {
    Users,
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    Target,
    Award,
    TrendingUp,
    Search,
    ChevronDown,
    Filter,
    BarChart2,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { marketingService } from '../../services/marketingService';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/marketing/districtTeam.module.css';

const DistrictTeam = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState([]);

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, critical
    const [sortBy, setSortBy] = useState('rank'); // rank, name
    const [selectedTaluka, setSelectedTaluka] = useState('All');

    // Derived Data
    const uniqueTalukas = [...new Set(teamData.map(m => m.taluka || m.state || 'Unknown'))].filter(Boolean).sort();

    // Aggregates
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [talukaData, setTalukaData] = useState([]);
    const [districtName, setDistrictName] = useState('');

    useEffect(() => {
        if (user) {
            loadTeamPerformance();
        }
    }, [user]);

    const loadTeamPerformance = async () => {
        setLoading(true);
        try {
            const profile = await marketingService.getProfile(user.id);
            if (!profile) throw new Error('Profile not found');

            setDistrictName(profile.district || 'Unknown District');

            // Fetch Performance + Members
            // 1. Get List to ensure we have contact details
            const members = await marketingService.getTeamMembers(profile.district);

            // 2. Get Stats
            const statsData = await marketingService.getTeamPerformance(profile.id, profile.district);
            const allPerformers = statsData?.allPerformers || [];

            setTotalRevenue(statsData?.totalAchievedRevenue || 0);
            setTotalOrders(statsData?.totalAchievedOrders || 0);

            // 3. Get Taluka Breakdown (Location Section Data)
            const talukaRes = await marketingService.getTalukaSales(profile.district);
            setTalukaData(talukaRes?.chartData || []);

            // Merge
            const merged = members.map(m => {
                const stats = allPerformers.find(p => p.id === m.id);
                // Calculate implicit rank or ensure default stats
                return {
                    ...m,
                    achievedRevenue: stats?.achievedRevenue || 0,
                    achievedOrders: stats?.achievedOrders || 0,
                    overallProgress: stats?.overallProgress || 0
                };
            });

            // Sort by progress desc as default "Rank"
            merged.sort((a, b) => b.overallProgress - a.overallProgress);

            setTeamData(merged);

        } catch (error) {
            console.error('Error loading team data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const getFilteredTeam = () => {
        let filtered = teamData.filter(member =>
            (member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.emp_id?.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedTaluka === 'All' || (member.taluka || member.state || 'Unknown') === selectedTaluka)
        );

        if (filter === 'active') {
            // Example: Had sales this month
            filtered = filtered.filter(m => m.achievedRevenue > 0);
        } else if (filter === 'critical') {
            // Example: Progress < 30%
            filtered = filtered.filter(m => m.overallProgress < 0.3);
        }

        if (sortBy === 'name') {
            filtered.sort((a, b) => a.full_name.localeCompare(b.full_name));
        } else {
            // Default rank sort
            filtered.sort((a, b) => b.overallProgress - a.overallProgress);
        }

        return filtered;
    };

    const filteredList = getFilteredTeam();

    if (loading) return <div className={styles.loading}>Loading Performance Data...</div>;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <div onClick={() => navigate(-1)} className={styles.iconButton}>
                        <ArrowLeft size={20} />
                    </div>
                    Team Performance
                </div>
            </div>

            {/* YOUR LOCATION SECTION */}
            <div className={styles.locationSection}>
                <div className={styles.locationCard}>
                    <div className={styles.locationHeader}>
                        <div className={styles.locIconBox}>
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className={styles.locTitle}>{districtName}</div>
                            <div className={styles.locSubtitle}>Your Assigned District</div>
                        </div>
                    </div>

                    <div className={styles.talukaLabel}>Taluka Performance Overview</div>
                    <div className={styles.talukaScroll}>
                        {talukaData.length === 0 ? (
                            <div className="text-xs text-gray-400 italic">No sales data recorded in this district yet.</div>
                        ) : (
                            talukaData.map((t, i) => (
                                <div key={i} className={styles.talukaItem}>
                                    <div className={styles.tName}>{t.taluka}</div>
                                    <div className={styles.tVal}>{t.sales}<span className={styles.tUnit}>T</span></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Gradient Card */}
            <div className={styles.summaryCard}>
                <div className={styles.summaryTitle}>District Overview ({new Date().toLocaleString('default', { month: 'long' })})</div>
                <div className={styles.summaryRow}>
                    <div className={styles.summaryBigStat}>
                        <span className={styles.summaryValue}>₹{(totalRevenue / 100000).toFixed(2)}L</span>
                        <span className={styles.summarySub}>Total Revenue Generated</span>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <BarChart2 size={24} />
                    </div>
                </div>

                <div className={styles.summaryMiniGrid}>
                    <div className={styles.miniStat}>
                        <span className={styles.miniLabel}>Total Orders</span>
                        <span className={styles.miniValue}>{totalOrders}</span>
                    </div>
                    <div className={styles.miniStat}>
                        <span className={styles.miniLabel}>Active Agents</span>
                        <span className={styles.miniValue}>{teamData.filter(m => m.achievedRevenue > 0).length}/{teamData.length}</span>
                    </div>
                    <div className={styles.miniStat}>
                        <span className={styles.miniLabel}>Top Performer</span>
                        <span className={styles.miniValue}>{teamData[0]?.full_name?.split(' ')[0] || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-4">
                {/* Custom Material Search Bar */}
                <div className={styles.searchWrapper}>
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <div className={styles.clearBtn} onClick={() => setSearchQuery('')}>
                                <X size={16} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Branch Filter (Scrollable) */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter by Branch</span>
                    </div>
                    <div className={styles.filterRow}>
                        <button
                            className={`${styles.filterChip} ${selectedTaluka === 'All' ? styles.filterChipActive : ''}`}
                            onClick={() => setSelectedTaluka('All')}
                        >
                            All Branches
                        </button>
                        {uniqueTalukas.map(taluka => (
                            <button
                                key={taluka}
                                className={`${styles.filterChip} ${selectedTaluka === taluka ? styles.filterChipActive : ''}`}
                                onClick={() => setSelectedTaluka(taluka)}
                            >
                                {taluka}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Filter Chips */}
                <div className={styles.filterRow}>
                    <button
                        className={`${styles.filterChip} ${filter === 'all' ? styles.filterChipActive : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Members
                    </button>
                    <button
                        className={`${styles.filterChip} ${filter === 'active' ? styles.filterChipActive : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        Active ({teamData.filter(m => m.achievedRevenue > 0).length})
                    </button>
                    <button
                        className={`${styles.filterChip} ${filter === 'critical' ? styles.filterChipActive : ''}`}
                        onClick={() => setFilter('critical')}
                    >
                        Low Performance
                    </button>
                </div>
            </div>

            {/* Team List */}
            <div className="flex flex-col gap-4">
                {filteredList.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <Users size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No executives found.</p>
                    </div>
                ) : (
                    filteredList.map((member, index) => (
                        <div key={member.id} className={styles.empCard}>
                            {/* Card Top: Avatar + Info + Rank Badge */}
                            <div className={styles.cardTop}>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>
                                        {member.full_name?.charAt(0)}
                                    </div>
                                    <div className={styles.infoCol}>
                                        <div className={styles.name}>{member.full_name}</div>
                                        <div className={styles.role}>
                                            <MapPin size={10} /> {member.taluka || member.state}
                                        </div>
                                    </div>
                                </div>
                                {index < 3 && sortBy !== 'name' && (
                                    <div className={`${styles.rankBadge} ${index === 0 ? styles.rank1 : index === 1 ? styles.rank2 : styles.rank3
                                        }`}>
                                        Rank #{index + 1}
                                    </div>
                                )}
                            </div>

                            {/* Performance Stats */}
                            <div className={styles.statGrid}>
                                <div className={styles.statBox}>
                                    <div className={styles.statLabel}><TrendingUp size={12} /> Revenue</div>
                                    <div className={styles.statValue}>₹{(member.achievedRevenue / 1000).toFixed(1)}k</div>
                                </div>
                                <div className={styles.statBox}>
                                    <div className={styles.statLabel}><Award size={12} /> Orders</div>
                                    <div className={styles.statValue}>{member.achievedOrders}</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className={styles.progressSection}>
                                <div className={styles.progressLabel}>
                                    <span>Monthly Goal</span>
                                    <span>{(member.overallProgress * 100).toFixed(0)}%</span>
                                </div>
                                <div className={styles.track}>
                                    <div
                                        className={`${styles.fill} ${member.overallProgress >= 0.8 ? styles.high :
                                            member.overallProgress >= 0.5 ? styles.med : styles.low
                                            }`}
                                        style={{ width: `${Math.min(member.overallProgress * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className={styles.contactRow}>
                                <a href={`tel:${member.phone_number}`} className={styles.actionBtn}>
                                    <Phone size={14} /> Call
                                </a>
                                <div style={{ width: 1, backgroundColor: '#f1f5f9' }}></div>
                                <a href={`mailto:${member.email}`} className={styles.actionBtn}>
                                    <Mail size={14} /> Email
                                </a>
                                {/* Could add 'View Routes' or 'Visits' here if available */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DistrictTeam;
