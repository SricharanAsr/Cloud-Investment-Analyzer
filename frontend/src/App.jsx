import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Briefcase, TrendingUp, RefreshCw, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'https://portfoliofunction9914.azurewebsites.net/api';

function App() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/get_portfolios`);
      setPortfolios(response.data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setMessage({ type: 'error', text: 'Failed to fetch portfolios. Check CORS or Azure Function status.' });
    }
    setLoading(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage({ type: 'info', text: 'Processing your portfolio with AI...' });

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          const response = await axios.post(`${API_BASE_URL}/upload`, arrayBuffer, {
            headers: { 'Content-Type': 'application/octet-stream' }
          });
          setMessage({ type: 'success', text: 'Successfully processed portfolio!' });
          fetchPortfolios();
        } catch (err) {
          setMessage({ type: 'error', text: 'AI analysis failed. Please try again.' });
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setMessage({ type: 'error', text: 'File read failed.' });
    }
    setUploading(false);
  };

  const calculateTotalValue = (assets) => {
    return assets.reduce((sum, asset) => sum + (asset.total_value || 0), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#0f1014] text-gray-100 font-sans p-4 md:p-8">
      {/* Header */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
            <TrendingUp size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Investment Analyzer
          </h1>
        </div>
        <button 
          onClick={fetchPortfolios}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-sm font-medium"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </nav>

      <main className="max-w-7xl mx-auto">
        {/* Hero / Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="mb-6 p-4 bg-indigo-500/10 rounded-full group-hover:scale-110 transition-transform">
              <Upload size={40} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Upload Screenshot</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Drag and drop your portfolio screenshot or click to browse. Our AI will extract stock symbols, quantities, and prices automatically.
            </p>
            <label className="w-full">
              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              <div className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold cursor-pointer shadow-lg shadow-indigo-900/20 active:scale-95 transition-all text-center">
                {uploading ? 'Analyzing...' : 'Select File'}
              </div>
            </label>
            {message && (
              <div className={`mt-6 flex items-center gap-3 text-sm p-4 rounded-xl w-full ${
                message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                message.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : 
                 message.type === 'error' ? <AlertCircle size={18} /> : 
                 <RefreshCw size={18} className="animate-spin" />}
                {message.text}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border border-indigo-500/20 rounded-2xl p-8 relative overflow-hidden">
             <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="text-indigo-400 font-semibold text-xs tracking-widest uppercase mb-1">Portfolio Insights</div>
                  <h3 className="text-3xl font-bold mb-4">AI Analysis Ready</h3>
                  <p className="text-gray-300 max-w-md leading-relaxed">
                    Instantly transform your static screenshots into actionable financial data. Your processed portfolios are securely stored and analyzed in real-time.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: 'Scanned', value: portfolios.length, icon: FileText },
                    { label: 'Cloud Status', value: 'Active', icon: CheckCircle },
                    { label: 'AI Version', value: '3.0', icon: TrendingUp },
                    { label: 'Database', value: 'Cosmos', icon: Briefcase },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                      <stat.icon size={16} className="text-indigo-400 mb-2" />
                      <div className="text-xs text-gray-500 font-medium mb-1">{stat.label}</div>
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Portfolio List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Briefcase size={24} className="text-indigo-400" />
              Processed Portfolios
            </h2>
          </div>

          {!loading && portfolios.length === 0 && (
            <div className="py-20 text-center bg-white/2 border border-dashed border-white/10 rounded-2xl">
              <div className="text-gray-500 mb-2">No data yet</div>
              <div className="text-gray-600 text-sm">Upload a screenshot above to begin analysis.</div>
            </div>
          )}

          {loading ? (
             <div className="flex justify-center p-20">
               <RefreshCw size={48} className="text-indigo-500 animate-spin opacity-50" />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {portfolios.map((portfolio) => (
                <div key={portfolio.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl shadow-black/20 group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-xs text-indigo-400 font-bold tracking-widest uppercase mb-1">
                          {new Date(portfolio.processed_at).toLocaleDateString()}
                        </div>
                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {portfolio.filename || 'Web Upload'}
                        </h4>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Portfolio Value</div>
                        <div className="text-xl font-bold text-emerald-400">${calculateTotalValue(portfolio.assets)}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {portfolio.assets.length > 0 ? (
                        portfolio.assets.map((asset, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-white/2 rounded-xl group-hover:bg-white/5 transition-colors border border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400 font-bold text-xs w-10 text-center">
                                {asset.ticker}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-white">Qty: {asset.quantity}</div>
                                <div className="text-[10px] text-gray-500">Price: ${asset.price}</div>
                              </div>
                            </div>
                            <div className="font-bold text-sm text-gray-200">
                              ${asset.total_value?.toFixed(2)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-amber-400 bg-amber-400/5 border border-amber-400/20 p-3 rounded-lg flex items-center gap-2">
                           <AlertCircle size={14} />
                           Could not parse stock symbols.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -z-10 rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/5 blur-[100px] -z-10 rounded-full"></div>
    </div>
  );
}

export default App;
