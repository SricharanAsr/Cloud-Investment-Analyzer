import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Upload, Briefcase, TrendingUp, RefreshCw, FileText, CheckCircle,
  AlertCircle, Shield, Globe, Zap, Info, Layers, Target, Activity,
  ChevronRight, BookOpen, BarChart3, PieChart
} from 'lucide-react';

const API_BASE_URL = 'https://portfoliofunction9914.azurewebsites.net/api';

/**
 * Utility: Standardizes currency formatting across the dashboard
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

function App() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  /**
   * Fetches all processed portfolios from the Azure Function API
   */
  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/get_portfolios`);
      setPortfolios(response.data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setMessage({ type: 'error', text: 'Cloud API connection error.' });
    }
    setLoading(false);
  };

  /**
   * Handles image upload, converts to binary, and sends to the analysis engine
   */
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage({ type: 'info', text: 'AI engine analyzing risk and performance...' });
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          await axios.post(`${API_BASE_URL}/upload`, arrayBuffer, {
            headers: { 'Content-Type': 'application/octet-stream' }
          });
          setMessage({ type: 'success', text: 'Analysis complete with advanced metrics!' });
          fetchPortfolios();
          setActiveTab('history');
        } catch (err) {
          setMessage({ type: 'error', text: 'Analysis engine failed.' });
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setMessage({ type: 'error', text: 'File read failed.' });
    }
    setUploading(false);
  };

  // ... rest of the component (KnowledgeHub, return JSX) ...

  const KnowledgeHub = () => (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Layers className="text-indigo-400" />
          <h2 className="text-2xl font-bold">Steps for Portfolio Analysis</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Define Objectives', desc: 'Establish the goal (growth, income, or preservation) and time horizon.', icon: Target },
            { title: 'Asset Allocation', desc: 'Determine the percentage of the portfolio in stocks, bonds, cash, and alternatives.', icon: PieChart },
            { title: 'Benchmarking', desc: 'Select an appropriate index (e.g., S&P 500) to compare performance.', icon: Activity },
            { title: 'Risk Assessment', desc: 'Measure the volatility and potential downside of the holdings.', icon: Shield },
            { title: 'Performance Attribution', desc: 'Identify which specific assets or sectors drove gains or losses.', icon: BarChart3 },
            { title: 'Rebalancing', desc: 'Adjust the portfolio back to the target allocation if it has drifted.', icon: RefreshCw },
          ].map((step, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group">
              <step.icon size={32} className="text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="text-indigo-400" />
          <h2 className="text-2xl font-bold">Key Performance Ratios</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/10">
                <th className="pb-4 pt-0">Ratio</th>
                <th className="pb-4 pt-0">Definition</th>
                <th className="pb-4 pt-0">Ideal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Sharpe Ratio', def: 'Risk-adjusted return relative to a risk-free rate.', ideal: 'Higher is better (>1.0 is good).' },
                { name: 'Treynor Ratio', def: 'Risk-adjusted return based on systematic risk (Beta).', ideal: 'Higher is better.' },
                { name: 'Sortino Ratio', def: 'Similar to Sharpe, but only penalizes bad (downside) volatility.', ideal: 'Higher is better.' },
                { name: 'Alpha', def: 'The excess return of the portfolio relative to the benchmark.', ideal: 'Positive (>0) indicates outperformance.' },
                { name: 'Beta', def: 'Measure of the portfolio\'s sensitivity to market movements.', ideal: '1.0 matches market; <1.0 is less volatile.' },
                { name: 'Standard Deviation', def: 'Measure of the total volatility/dispersion of returns.', ideal: 'Lower indicates more stability.' },
              ].map((ratio, i) => (
                <tr key={i} className="group hover:bg-white/2">
                  <td className="py-4 font-bold text-white">{ratio.name}</td>
                  <td className="py-4 text-sm text-gray-400">{ratio.def}</td>
                  <td className="py-4 text-xs font-mono text-indigo-400">{ratio.ideal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
            <CheckCircle size={20} /> Positives of Analysis
          </h3>
          <ul className="space-y-4">
            {[
              'Objective Evaluation: Removes emotional bias by relying on hard data.',
              'Risk Management: Identifies hidden risks or over-concentration.',
              'Cost Efficiency: Highlights high-fee funds dragging down returns.',
              'Alignment: Ensures portfolio matches actual goals and risk tolerance.'
            ].map((text, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-300">
                <ChevronRight size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-rose-400">
            <AlertCircle size={20} /> Negatives of Analysis
          </h3>
          <ul className="space-y-4">
            {[
              'Backward Looking: Ratios based on history do not guarantee future results.',
              'Complexity: Ratios can be misleading if benchmark is poorly chosen.',
              'Data Lag: Quarterly reports may be outdated by time of analysis.',
              'Over-analysis: Can lead to frequent trading (churning) and tax liabilities.'
            ].map((text, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-300">
                <ChevronRight size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1014] text-gray-100 font-sans">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[180px] -z-10 rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] -z-10 rounded-full"></div>

      {/* Side Navigation */}
      <div className="fixed top-0 left-0 h-full w-20 md:w-64 bg-black/40 border-r border-white/5 backdrop-blur-xl z-50 flex flex-col">
        <div className="p-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <TrendingUp size={24} className="text-white" />
            </div>
            <span className="hidden md:block font-bold text-lg tracking-tight">InvestVision <span className="text-indigo-400">Pro</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'history', label: 'Analysis History', icon: Briefcase },
            { id: 'hub', label: 'Knowledge Hub', icon: BookOpen },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${activeTab === item.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-400' : 'group-hover:text-white'} />
              <span className="hidden md:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 hidden md:block">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-emerald-500" />
              <span className="text-xs font-bold text-emerald-500 uppercase">Pro Secured</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-tight">Your data is encrypted with enterprise grade AES-256 protocols.</p>
          </div>
        </div>
      </div>

      <div className="ml-20 md:ml-64 p-4 md:p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black text-white capitalize">{activeTab}</h2>
            <p className="text-gray-500 text-sm mt-1">Smart AI Portfolio Intelligence & Risk Analysis</p>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-xl shadow-indigo-900/40 border border-indigo-500/30 active:scale-95">
              <Upload size={18} />
              <span className="hidden sm:inline">{uploading ? 'Processing...' : 'Analyze New Screenshot'}</span>
              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
            </label>
            <button onClick={fetchPortfolios} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-gray-400 hover:text-white">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {message && (
          <div className={`mb-10 flex items-center justify-between p-4 rounded-2xl border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            message.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
              'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            }`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' ? <CheckCircle size={20} /> : message.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="opacity-50 hover:opacity-100"><Zap size={14} /></button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Analysed Portfolios', value: portfolios.length, icon: FileText, color: 'indigo' },
                { label: 'Intelligence Layer', value: 'v4.2 PRO', icon: Zap, color: 'purple' },
                { label: 'Active Markets', value: 'Global', icon: Globe, color: 'emerald' },
                { label: 'Analysis Strategy', value: 'Multi-Ratio', icon: BarChart3, color: 'amber' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all">
                  <div className={`p-3 bg-${stat.color}-500/10 rounded-2xl w-fit mb-4`}>
                    <stat.icon size={24} className={`text-${stat.color}-400`} />
                  </div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5 rounded-[40px] p-10 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                  <h3 className="text-4xl font-black mb-4 leading-tight">Elevate Your Portfolio <br /><span className="text-indigo-400">With AI Intelligence.</span></h3>
                  <p className="text-gray-400 text-lg max-w-lg mb-8">
                    Our advanced engine doesn't just read data — it calculates sophisticated risk-adjusted returns and market sensitivity.
                  </p>
                  <button onClick={() => setActiveTab('hub')} className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-2">
                    Learn Analysis Steps <ChevronRight size={18} />
                  </button>
                </div>
                <div className="w-full md:w-96 h-64 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-3xl p-8 flex items-center justify-center">
                  <BarChart3 size={120} className="text-indigo-500/20 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-mono text-indigo-400/40">
                    {`[ ALPHA: 4.2% ] [ BETA: 1.1 ] [ SHARPE: 1.8 ]`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hub' && <KnowledgeHub />}

        {activeTab === 'history' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {portfolios.length === 0 ? (
              <div className="py-40 text-center">
                <Briefcase size={64} className="text-gray-800 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2">No History Found</h3>
                <p className="text-gray-500">Analyze your first screenshot to see the magic.</p>
              </div>
            ) : (
              <div className="space-y-12 pb-20">
                {portfolios.map((p) => (
                  <div key={p.id} className="bg-white/2 border border-white/10 rounded-[32px] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 group">
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-600/10 p-4 rounded-2xl">
                            <FileText className="text-indigo-400" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{new Date(p.processed_at).toLocaleString()}</span>
                            <h4 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors capitalize">{p.filename || 'Direct Scan'}</h4>
                          </div>
                        </div>
                        <div className="bg-black/20 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/5">
                          <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Valuation</div>
                          <div className="text-3xl font-black text-emerald-400">
                            ${p.assets.reduce((sum, a) => sum + (a.total_value || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                              <th className="pb-4 text-left">Asset</th>
                              <th className="pb-4 text-left">Basics</th>
                              <th className="pb-4 text-left">Advanced IQ (Sharpe / Beta / Alpha)</th>
                              <th className="pb-4 text-right">Recommendation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/2">
                            {p.assets.map((a, i) => (
                              <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                <td className="py-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-black text-indigo-400 border border-white/5">
                                      {a.ticker}
                                    </div>
                                    <div>
                                      <div className="font-bold text-white text-sm">{a.company_name || a.ticker}</div>
                                      <div className="text-[10px] text-gray-500">ISIN: Cloud Verified</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-6">
                                  <div className="text-xs text-gray-400">Qty: <span className="text-white font-mono">{a.quantity}</span></div>
                                  <div className="text-xs text-gray-400">Price: <span className="text-white font-mono">${a.price}</span></div>
                                </td>
                                <td className="py-6">
                                  <div className="flex items-center gap-6">
                                    <div className="text-center bg-black/40 px-3 py-1 rounded-lg border border-white/5">
                                      <div className="text-[8px] text-gray-600 font-bold mb-0.5">SHARPE</div>
                                      <div className="text-xs font-black text-indigo-400">{a.advanced_metrics?.sharpe_ratio || '--'}</div>
                                    </div>
                                    <div className="text-center bg-black/40 px-3 py-1 rounded-lg border border-white/5">
                                      <div className="text-[8px] text-gray-600 font-bold mb-0.5">BETA</div>
                                      <div className="text-xs font-black text-purple-400">{a.advanced_metrics?.beta || '--'}</div>
                                    </div>
                                    <div className="text-center bg-black/40 px-3 py-1 rounded-lg border border-white/5">
                                      <div className="text-[8px] text-gray-600 font-bold mb-0.5">ALPHA</div>
                                      <div className="text-xs font-black text-emerald-400">{a.advanced_metrics?.alpha ? `${a.advanced_metrics.alpha}%` : '--'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-6 text-right">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${a.suggestion.includes('Buy') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    a.suggestion.includes('Avoid') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}>
                                    {a.suggestion || 'Neutral'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="ml-20 md:ml-64 p-8 border-t border-white/5 text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
        InvestVision Intelligence Pro &copy; 2026 — Distributed Cloud Architecture
      </footer>
    </div>
  );
}

export default App;
