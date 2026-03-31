import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        setIsLoading(true);
        Cookies.remove('token');
        setTimeout(() => {
            setIsLoading(false);
            navigate('/login');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <div className="max-w-6xl mx-auto">
                
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-fade-in">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-vortexBuy flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-vortexBuy/30 group-hover:scale-105 transition-transform duration-500">
                            A
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100 cursor-pointer hover:bg-gray-50">
                            📸
                        </div>
                    </div>
                    
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Adithya <span className="text-vortexBuy">Vortex</span></h1>
                        <p className="text-gray-500 font-medium mt-1">Premium Member since March 2024</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            <span className="px-3 py-1 bg-vortexBuy/10 text-vortexBuy text-[10px] font-bold rounded-full uppercase tracking-wider">Elite Tier</span>
                            <span className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Verified</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="md:ml-auto px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-2xl hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all shadow-sm active:scale-95"
                    >
                        {isLoading ? 'Processing...' : 'Logout Securely'}
                    </button>
                </div>

                {/* CONTENT GRID */}
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* LEFT PANEL: ACCOUNT DETAILS */}
                    <div className="lg:col-span-1 space-y-6 animate-fade-up">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-vortexBuy">👤</span> Account Identity
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">Email Connection</label>
                                    <div className="font-bold text-gray-900">adithya@vortex.com</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">Mobile Access</label>
                                    <div className="font-bold text-gray-900">+91 99887 76655</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">Default Address</label>
                                    <div className="font-bold text-gray-900 leading-relaxed">
                                        Vortex Towers, Suite 101<br/>
                                        Tech Park, Bangalore<br/>
                                        Karnataka - 560001
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-xl text-sm hover:bg-gray-100 transition-all">
                                    Update Credentials
                                </button>
                            </div>
                        </div>

                        <div className="bg-black p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                           <div className="relative z-10">
                              <h3 className="text-xl font-bold mb-2">Vortex Rewards</h3>
                              <p className="text-gray-400 text-xs mb-6">Unlock exclusive benefits and early access.</p>
                              <div className="text-4xl font-black text-vortexBuy mb-6">2,450 <span className="text-sm font-medium text-white/50 tracking-normal">Points</span></div>
                              <button className="w-full py-3 bg-vortexBuy text-white font-bold rounded-xl text-sm shadow-lg shadow-vortexBuy/20 hover:scale-[1.02] transition-all">
                                 Redeem Benefits
                              </button>
                           </div>
                           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-vortexBuy/20 rounded-full blur-3xl group-hover:bg-vortexBuy/30 transition-colors" />
                        </div>
                    </div>

                    {/* RIGHT PANEL: ACTIVITY & ORDERS */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-up stagger-1">
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                           <div className="flex items-center justify-between mb-8">
                              <h3 className="text-2xl font-bold text-gray-900">Recent Marketplace Activity</h3>
                              <button className="text-sm font-bold text-vortexBuy hover:underline">View All Orders</button>
                           </div>

                           <div className="space-y-6">
                              {[
                                { id: '#VX-1029', date: 'March 24, 2024', status: 'Delivered', price: '₹42,990', item: 'Vortex Quantum Laptop' },
                                { id: '#VX-1025', date: 'March 18, 2024', status: 'Delivered', price: '₹1,290', item: 'Infinite Loop Hoodie' },
                                { id: '#VX-982', date: 'Feb 12, 2024', status: 'Delivered', price: '₹5,400', item: 'Noise-Cancelling AeroBuds' }
                              ].map((order, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-all group">
                                   <div className="flex gap-4 items-center">
                                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-lg border border-gray-100 shadow-sm">📦</div>
                                      <div>
                                         <div className="font-bold text-gray-900">{order.item}</div>
                                         <div className="text-xs text-gray-400 mt-1">Order {order.id} • {order.date}</div>
                                      </div>
                                   </div>
                                   <div className="flex items-center justify-between md:justify-end gap-10 mt-4 md:mt-0">
                                      <div className="text-right">
                                         <div className="font-black text-gray-900">{order.price}</div>
                                         <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{order.status}</div>
                                      </div>
                                      <button className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:bg-vortexBuy hover:text-white transition-all shadow-sm">
                                         →
                                      </button>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>

                        {/* SECURITY CARD */}
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                           <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-3xl">🛡️</div>
                           <div className="flex-1 text-center md:text-left">
                              <h4 className="text-xl font-bold mb-1">Two-Factor Authentication</h4>
                              <p className="text-gray-500 text-sm">Add an extra layer of security to your account. Your identity is our priority.</p>
                           </div>
                           <button className="px-6 py-3 bg-black text-white font-bold rounded-xl text-sm whitespace-nowrap hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-black/10">
                              Enable Security
                           </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
