import React from 'react';

const ContactPage = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* HEADER */}
      <section className='pt-24 pb-16 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 text-center'>
        <span className='inline-block mb-6 px-4 py-1.5 rounded-full bg-vortexBuy/10 text-vortexBuy text-sm font-bold tracking-widest uppercase animate-fade-in'>
          Connect With Us
        </span>
        <h1 className='text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter animate-fade-up'>
          HOW CAN WE <span className='text-vortexBuy'>HELP?</span>
        </h1>
        <p className='text-xl text-gray-500 font-medium max-w-2xl mx-auto animate-fade-up stagger-1'>
          Have a question about a product, order, or just want to say hello? Our team is always here for you.
        </p>
      </section>

      {/* CONTACT GRID */}
      <section className='pb-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'>
        <div className='grid lg:grid-cols-2 gap-20 p-8 md:p-16 rounded-[3rem] bg-gray-50 border border-gray-100 items-start'>
          
          {/* CONTACT INFO */}
          <div className='animate-fade-up'>
             <h2 className='text-3xl font-bold mb-10'>Contact Information</h2>
             
             <div className='space-y-12'>
                <div className='flex items-start gap-6 group'>
                   <div className='w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md group-hover:bg-vortexBuy group-hover:text-white transition-all duration-300'>
                      📍
                   </div>
                   <div>
                      <h4 className='text-lg font-bold mb-2'>Our Flagship HQ</h4>
                      <p className='text-gray-600 leading-relaxed'>123 Vortex Avenue, Silicon Valley,<br/>California, CA 94000</p>
                   </div>
                </div>

                <div className='flex items-start gap-6 group'>
                   <div className='w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md group-hover:bg-vortexBuy group-hover:text-white transition-all duration-300'>
                      📧
                   </div>
                   <div>
                      <h4 className='text-lg font-bold mb-2'>Email Us Anytime</h4>
                      <p className='text-gray-600 font-medium hover:text-vortexBuy transition-colors'>hello@vortexbuy.com</p>
                      <p className='text-gray-600 font-medium hover:text-vortexBuy transition-colors'>support@vortexbuy.com</p>
                   </div>
                </div>

                <div className='flex items-start gap-6 group'>
                   <div className='w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md group-hover:bg-vortexBuy group-hover:text-white transition-all duration-300'>
                      📞
                   </div>
                   <div>
                      <h4 className='text-lg font-bold mb-2'>Call Our Experts</h4>
                      <p className='text-gray-600 font-medium'>+1 (800) VORTEX-01</p>
                      <p className='text-gray-400 text-sm mt-1'>Mon-Fri: 9am - 6pm PST</p>
                   </div>
                </div>
             </div>

             {/* Social Links */}
             <div className='mt-16 pt-16 border-t border-gray-200'>
                <h5 className='text-sm font-bold uppercase tracking-widest text-gray-400 mb-6'>Join Our Community</h5>
                <div className='flex gap-4'>
                   {['Instagram', 'Twitter', 'LinkedIn', 'YouTube'].map(social => (
                      <div key={social} className='px-4 py-2 bg-white rounded-xl text-sm font-bold text-gray-600 border border-gray-100 hover:border-vortexBuy hover:text-vortexBuy cursor-pointer transition-all duration-300'>
                         {social}
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* CONTACT FORM */}
          <div className='bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl shadow-black/5 animate-fade-up stagger-2'>
             <form className='space-y-8'>
                <div className='grid md:grid-cols-2 gap-8'>
                   <div className='space-y-2'>
                      <label className='text-sm font-bold text-gray-900'>Your Full Name</label>
                      <input 
                        type="text" 
                        placeholder='John Doe' 
                        className='w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-vortexBuy/20 focus:bg-white transition-all font-medium'
                      />
                   </div>
                   <div className='space-y-2'>
                      <label className='text-sm font-bold text-gray-900'>Email Address</label>
                      <input 
                        type="email" 
                        placeholder='john@example.com' 
                        className='w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-vortexBuy/20 focus:bg-white transition-all font-medium'
                      />
                   </div>
                </div>

                <div className='space-y-2'>
                   <label className='text-sm font-bold text-gray-900'>Inquiry Topic</label>
                   <select className='w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-vortexBuy/20 focus:bg-white transition-all font-medium appearance-none cursor-pointer'>
                      <option>General Inquiry</option>
                      <option>Order Status</option>
                      <option>Report an Issue</option>
                      <option>Partnership Request</option>
                   </select>
                </div>

                <div className='space-y-2'>
                   <label className='text-sm font-bold text-gray-900'>How Can We Help?</label>
                   <textarea 
                     rows={5} 
                     placeholder='Tell us what you need...'
                     className='w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-vortexBuy/20 focus:bg-white transition-all font-medium resize-none'
                   />
                </div>

                <button className='w-full py-5 bg-black text-white rounded-2xl font-black text-lg hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center gap-3 group'>
                  Send Message
                  <span className='group-hover:translate-x-2 transition-transform duration-300'>🚀</span>
                </button>
             </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
