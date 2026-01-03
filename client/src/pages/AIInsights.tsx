import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import { toast } from 'react-toastify';

interface DailySummary {
  summary: string;
  statistics: {
    low: number;
    medium: number;
    high: number;
    severe: number;
  };
  highRiskAreas: string[];
  reportsCount: number;
  overallSeverity: string;
  generatedAt: string;
}

interface WarningMessage {
  message: string;
  generatedAt: string;
}

interface EmergencyMessage {
  message: string;
  characterCount: number;
  area: string;
  severity: string;
  generatedAt: string;
}

function AIInsights() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'daily' | 'warning' | 'emergency'>('daily');

  // Daily Summary State
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);

  // Warning Message State
  const [warningData, setWarningData] = useState({
    area: '',
    severity: 'medium',
    specificDetails: '',
  });
  const [warningMessage, setWarningMessage] = useState<WarningMessage | null>(null);
  const [loadingWarning, setLoadingWarning] = useState(false);

  // Emergency SMS State
  const [emergencyData, setEmergencyData] = useState({
    area: '',
    severity: 'medium',
    language: 'english',
  });
  const [emergencyMessage, setEmergencyMessage] = useState<EmergencyMessage | null>(null);
  const [loadingEmergency, setLoadingEmergency] = useState(false);

  // Redirect non-admin users
  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">This page is only accessible to administrators.</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const fetchDailySummary = async () => {
    setLoadingDaily(true);
    try {
      const response = await api.get('/ai/daily-summary');
      if (response.data.success) {
        setDailySummary(response.data.data);
        toast.success('Daily summary generated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate daily summary');
    } finally {
      setLoadingDaily(false);
    }
  };

  const generateWarning = async () => {
    if (!warningData.area || !warningData.severity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoadingWarning(true);
    try {
      const response = await api.post('/ai/warning-message', warningData);
      if (response.data.success) {
        setWarningMessage(response.data.data);
        toast.success('Warning message generated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate warning message');
    } finally {
      setLoadingWarning(false);
    }
  };

  const generateEmergencySMS = async () => {
    if (!emergencyData.area || !emergencyData.severity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoadingEmergency(true);
    try {
      const response = await api.post('/ai/emergency-message', emergencyData);
      if (response.data.success) {
        setEmergencyMessage(response.data.data);
        toast.success('Emergency SMS generated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate emergency message');
    } finally {
      setLoadingEmergency(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-2">AI Insights</h2>
            <p className="text-purple-100 text-lg">AI-powered flood analysis and emergency messaging</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg mb-6 border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'daily'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Daily Summary
            </button>
            <button
              onClick={() => setActiveTab('warning')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'warning'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Warning Message
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'emergency'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Emergency SMS
            </button>
          </nav>
        </div>
      </div>

      {/* Daily Summary Tab */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Daily Flood Summary</h3>
                <p className="text-gray-600 mt-1">AI-generated analysis of today's flood situation</p>
              </div>
              <Button
                variant="primary"
                onClick={fetchDailySummary}
                disabled={loadingDaily}
              >
                {loadingDaily ? 'Generating...' : 'Generate Summary'}
              </Button>
            </div>

            {loadingDaily && <LoadingSpinner text="Analyzing flood data with AI..." />}

            {dailySummary && !loadingDaily && (
              <div className="space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                    <p className="text-3xl font-bold text-gray-900">{dailySummary.reportsCount}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Low</p>
                    <p className="text-3xl font-bold text-blue-600">{dailySummary.statistics.low}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200">
                    <p className="text-sm text-gray-600 mb-1">Medium</p>
                    <p className="text-3xl font-bold text-yellow-600">{dailySummary.statistics.medium}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">High</p>
                    <p className="text-3xl font-bold text-orange-600">{dailySummary.statistics.high}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                    <p className="text-sm text-gray-600 mb-1">Severe</p>
                    <p className="text-3xl font-bold text-red-600">{dailySummary.statistics.severe}</p>
                  </div>
                </div>

                {/* Overall Severity */}
                <div className={`p-6 rounded-xl border-2 ${
                  dailySummary.overallSeverity === 'Severe' ? 'bg-red-50 border-red-300' :
                  dailySummary.overallSeverity === 'High' ? 'bg-orange-50 border-orange-300' :
                  dailySummary.overallSeverity === 'Medium' ? 'bg-yellow-50 border-yellow-300' :
                  'bg-blue-50 border-blue-300'
                }`}>
                  <p className="text-sm font-medium text-gray-600 mb-1">Overall Severity</p>
                  <p className="text-2xl font-bold">{dailySummary.overallSeverity}</p>
                </div>

                {/* High Risk Areas */}
                {dailySummary.highRiskAreas.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      High-Risk Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dailySummary.highRiskAreas.map((area, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-lg font-medium text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                  <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Analysis
                  </h4>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800">{dailySummary.summary}</pre>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-right">
                  Generated at: {new Date(dailySummary.generatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning Message Tab */}
      {activeTab === 'warning' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate Warning Message</h3>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area/Location</label>
              <input
                type="text"
                value={warningData.area}
                onChange={(e) => setWarningData({ ...warningData, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Colombo District"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <select
                value={warningData.severity}
                onChange={(e) => setWarningData({ ...warningData, severity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="severe">Severe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific Details (Optional)</label>
              <textarea
                value={warningData.specificDetails}
                onChange={(e) => setWarningData({ ...warningData, specificDetails: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Additional context about the situation..."
              />
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={generateWarning}
              disabled={loadingWarning}
            >
              {loadingWarning ? 'Generating...' : 'Generate Warning Message'}
            </Button>

            {loadingWarning && <LoadingSpinner text="Generating warning message..." />}

            {warningMessage && !loadingWarning && (
              <div className="mt-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-6">
                <h4 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  Generated Warning Message
                </h4>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800">{warningMessage.message}</pre>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => navigator.clipboard.writeText(warningMessage.message)}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Generated at: {new Date(warningMessage.generatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emergency SMS Tab */}
      {activeTab === 'emergency' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate Emergency SMS</h3>
          <div className="space-y-4 max-w-2xl">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> SMS messages are limited to 160 characters for standard delivery.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area/Location</label>
              <input
                type="text"
                value={emergencyData.area}
                onChange={(e) => setEmergencyData({ ...emergencyData, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Galle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <select
                value={emergencyData.severity}
                onChange={(e) => setEmergencyData({ ...emergencyData, severity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="severe">Severe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={emergencyData.language}
                onChange={(e) => setEmergencyData({ ...emergencyData, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="english">English</option>
                <option value="sinhala">Sinhala</option>
                <option value="tamil">Tamil</option>
              </select>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={generateEmergencySMS}
              disabled={loadingEmergency}
            >
              {loadingEmergency ? 'Generating...' : 'Generate Emergency SMS'}
            </Button>

            {loadingEmergency && <LoadingSpinner text="Generating emergency SMS..." />}

            {emergencyMessage && !loadingEmergency && (
              <div className="mt-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-6">
                <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Generated SMS Message
                </h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
                  <p className="text-gray-900 font-medium">{emergencyMessage.message}</p>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${
                    emergencyMessage.characterCount <= 160 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {emergencyMessage.characterCount} / 160 characters
                  </span>
                  {emergencyMessage.characterCount > 160 && (
                    <span className="text-xs text-red-600">⚠ Exceeds SMS limit</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => navigator.clipboard.writeText(emergencyMessage.message)}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Generated at: {new Date(emergencyMessage.generatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default AIInsights;
