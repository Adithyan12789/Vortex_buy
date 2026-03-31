import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = Cookies.get('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch profile");
                Cookies.remove('token');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        setIsLoggingOut(true);
        Cookies.remove('token');
        setTimeout(() => {
            setIsLoggingOut(false);
            navigate('/login');
            window.location.reload();
        }, 1000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="w-12 h-12 border-4 border-vortexBuy border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <div className="max-w-6xl mx-auto">
                
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-fade-in">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2rem] bg-gray-900 border-4 border-white flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-black/10 group-hover:rotate-3 transition-all duration-500 overflow-hidden">
                            {user?.username?.[0]?.toUpperCase() || 'V'}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100 cursor-pointer hover:bg-gray-50">
                            📸
                        </div>
                    </div>
                    
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            {user?.username} <span className="text-vortexBuy">Vortex</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Premium Member • {user?.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            <span className="px-4 py-1 bg-vortexBuy/10 text-vortexBuy text-[10px] font-black rounded-full uppercase tracking-widest border border-vortexBuy/20 shadow-sm">Elite Tier</span>
                            <span className="px-4 py-1 bg-gray-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">Verified Identity</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="md:ml-auto px-8 py-4 bg-white border border-gray-100 text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        {isLoggingOut ? 'Terminating Session...' : 'Logout Securely'}
                    </button>
                </div>

                {/* CONTENT GRID */}
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* LEFT PANEL: ACCOUNT DETAILS */}
                    <div className="lg:col-span-1 space-y-6 animate-fade-up">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900">
                                <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm">👤</span> 
                                Account Intel
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Display Name</label>
                                    <div className="font-bold text-gray-800 text-lg">{user?.username}</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Verified Email</label>
                                    <div className="font-bold text-gray-800 text-lg">{user?.email}</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Security Level</label>
                                    <div className="font-bold text-emerald-500 uppercase tracking-widest text-xs">Tier 1 • Encrypted Access</div>
                                </div>
                                <div className="pt-4">
                                    <button className="w-full py-4 bg-gray-50 border border-gray-100 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all active:scale-95">
                                        Update Credentials
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl shadow-black/20 text-white relative overflow-hidden group">
                           <div className="relative z-10">
                              <h3 className="text-xl font-black mb-2">Vortex Rewards</h3>
                              <p className="text-gray-400 text-xs mb-8 font-medium">Accumulated through premium acquisitions.</p>
                              <div className="text-5xl font-black text-vortexBuy mb-8 tracking-tighter">1,240 <span className="text-sm font-bold text-white/40 tracking-widest uppercase">PTS</span></div>
                              <button className="w-full py-4 bg-vortexBuy text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-vortexBuy/30 hover:scale-[1.02] active:scale-95 transition-all">
                                 Redeem Benefits
                              </button>
                           </div>
                           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-vortexBuy/10 rounded-full blur-3xl group-hover:bg-vortexBuy/20 transition-colors" />
                        </div>
                    </div>

                    {/* RIGHT PANEL: ACTIVITY & ORDERS */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-up stagger-1">
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                           <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                              <div>
                                <h3 className="text-[10px] font-black text-vortexBuy uppercase tracking-[0.3em] mb-2">Acquisitions</h3>
                                <h4 className="text-3xl font-black text-gray-900 tracking-tight">Marketplace Activity</h4>
                              </div>
                              <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-vortexBuy transition-colors">View Full History</button>
                           </div>

                           <div className="space-y-4">
                              {[
                                { id: '#VX-1029', date: 'Just now', status: 'Processing', price: '₹--', item: 'Pending Transactions' }
                              ].map((order, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                                   <div className="flex gap-6 items-center">
                                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">📦</div>
                                      <div>
                                         <div className="font-black text-gray-900 text-lg leading-tight">{order.item}</div>
                                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{order.id} • {order.date}</div>
                                      </div>
                                   </div>
                                   <div className="flex items-center justify-between md:justify-end gap-12 mt-6 md:mt-0">
                                      <div className="text-right">
                                         <div className="font-black text-gray-900 text-xl tracking-tight">{order.price}</div>
                                         <div className="text-[10px] font-black text-vortexBuy uppercase tracking-[0.2em] mt-1">{order.status}</div>
                                      </div>
                                      <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm group-hover:translate-x-1">
                                         →
                                      </button>
                                   </div>
                                </div>
                              ))}
                              <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                                 <p className="text-gray-400 font-bold italic text-sm">Secure transactions will populate here.</p>
                              </div>
                           </div>
                        </div>

                        {/* SECURITY CARD */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-8 group">
                           <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">🛡️</div>
                           <div className="flex-1 text-center lg:text-left">
                              <h4 className="text-xl font-black mb-2 text-gray-900">Encrypted Protection Active</h4>
                              <p className="text-gray-500 text-sm font-medium leading-relaxed">Your account is secured with multi-layer encryption. Every transaction is monitored for unauthorized access.</p>
                           </div>
                           <div className="px-4 py-2 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-200">
                              Active
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
