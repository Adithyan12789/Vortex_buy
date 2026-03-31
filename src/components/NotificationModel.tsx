import React from 'react';

const NotificationModel = () => {
    // Mock notifications
    const notifications = [
        { id: 1, title: 'Order Dispatched', message: 'Your order #VX-1029 has been shipped.', time: '2h ago', icon: '📦', isNew: true },
        { id: 2, title: 'Price Drop Alert', message: 'The Quantum Laptop is now 15% off!', time: '5h ago', icon: '🔥', isNew: true },
        { id: 3, title: 'Welcome to Vortex', message: 'Thanks for joining our premium network.', time: '1d ago', icon: '✨', isNew: false },
    ];

    return (
        <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden animate-fade-up">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-black text-gray-900 tracking-tight">Notifications</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-vortexBuy bg-vortexBuy/10 px-2 py-0.5 rounded-full">3 New</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-4xl mb-4">🔔</div>
                        <p className="text-gray-400 text-sm font-medium">All caught up!</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map((n) => (
                            <div key={n.id} className={`p-5 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 relative ${n.isNew ? 'bg-vortexBuy/[0.02]' : ''}`}>
                                {n.isNew && <div className="absolute top-6 left-2 w-1.5 h-1.5 bg-vortexBuy rounded-full" />}
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-xl shadow-sm">
                                    {n.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{n.title}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-gray-50 text-center">
                <button className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-vortexBuy transition-colors">
                    Mark all as read
                </button>
            </div>
        </div>
    );
};

export default NotificationModel;
