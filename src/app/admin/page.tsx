import React, { useState, useRef } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('ADD_PRODUCT');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    categorySlug: '',
    stock: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilesChange = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const added = Array.from(newFiles);
    const combined = [...files, ...added].slice(0, 10); // max 10
    setFiles(combined);
    setPreviews(combined.map(f => URL.createObjectURL(f)));
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    setPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, (formData as any)[key]));
      files.forEach(f => data.append('images', f));

      await axios.post('http://localhost:5000/api/products', data);
      setMessage('Product added successfully!');
      setFormData({ name: '', description: '', price: '', discountedPrice: '', categorySlug: '', stock: '' });
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      setMessage('Failed to add product. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-10 transition-all duration-300">
        <div className="p-6 text-2xl font-bold tracking-widest text-center border-b border-gray-700 bg-gray-800">
          VORTEX<span className="text-pink-500">BUY</span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-4">
          <button 
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 outline-none $\\{activeTab === 'DASHBOARD' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'\\}`}
            onClick={() => setActiveTab('DASHBOARD')}
          >
            <span className="material-icons-outlined mr-3">dashboard</span>
            Dashboard
          </button>
          <button 
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 outline-none $\\{activeTab === 'ADD_PRODUCT' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'\\}`}
            onClick={() => setActiveTab('ADD_PRODUCT')}
          >
            <span className="material-icons-outlined mr-3">add_circle</span>
            Add Product
          </button>
          <button 
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 outline-none $\\{activeTab === 'ORDERS' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'\\}`}
            onClick={() => setActiveTab('ORDERS')}
          >
            <span className="material-icons-outlined mr-3">shopping_cart</span>
            Orders
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8 md:p-12 lg:p-16">
          {activeTab === 'ADD_PRODUCT' && (
            <div className="max-w-4xl mx-auto animation-fade-in">
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Create New Product</h1>
                <p className="text-gray-500 mt-2 text-lg">Add exciting new inventory to your store instantly.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
                <form onSubmit={handleAddProduct} className="space-y-6">
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                      <input 
                        type="text" name="name" required value={formData.name} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none" 
                        placeholder="e.g. Premium Wireless Headphones"
                      />
                    </div>
                  </div>

                  {/* Multi-image upload zone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Images <span className="text-gray-400 font-normal">(up to 10 — first image is the main photo)</span>
                    </label>

                    {/* Drop zone / click area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); handleFilesChange(e.dataTransfer.files); }}
                      className="relative flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-pink-200 rounded-xl bg-pink-50 hover:bg-pink-100 cursor-pointer transition-colors duration-200 group"
                    >
                      <span className="material-icons-outlined text-4xl text-pink-400 mb-2 group-hover:scale-110 transition-transform">cloud_upload</span>
                      <p className="text-sm font-semibold text-pink-600">Click to browse or drag &amp; drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Max 10 images</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFilesChange(e.target.files)}
                      />
                    </div>

                    {/* Previews grid */}
                    {previews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {previews.map((src, i) => (
                          <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-square">
                            <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                            {i === 0 && (
                              <span className="absolute top-1 left-1 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight">Main</span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="absolute top-1 right-1 bg-gray-900/70 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea 
                      name="description" required value={formData.description} onChange={handleInputChange} rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none resize-none" 
                      placeholder="Describe the product details and key features..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                      <input 
                        type="number" step="0.01" name="price" required value={formData.price} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none" 
                        placeholder="99.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Discounted Price</label>
                      <input 
                        type="number" step="0.01" name="discountedPrice" value={formData.discountedPrice} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none" 
                        placeholder="79.99 (Optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                      <input 
                        type="number" name="stock" required value={formData.stock} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none" 
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category Slug</label>
                    <input 
                      type="text" name="categorySlug" required value={formData.categorySlug} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none" 
                      placeholder="e.g. electronics"
                    />
                  </div>

                  {message && (
                    <div className={`p-4 rounded-xl font-medium $\\{message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'\\}`}>
                      {message}
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-pink-500/20 transform transition hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? 'Publishing...' : 'Publish Product'}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {activeTab !== 'ADD_PRODUCT' && (
             <div className="flex items-center justify-center h-[60vh] text-gray-400 flex-col animation-fade-in">
               <span className="material-icons-outlined text-6xl mb-4 opacity-50">construction</span>
               <h2 className="text-2xl font-semibold">Under Construction</h2>
               <p className="mt-2 text-center max-w-sm">The {activeTab.toLowerCase()} feature is currently being built for the next release.</p>
             </div>
          )}
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .animation-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default AdminDashboard;
