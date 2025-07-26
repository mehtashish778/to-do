import React, { useState, useEffect } from 'react';
import { Settings, Wifi, WifiOff, TestTube } from 'lucide-react';
import { OllamaConfig } from '@/types';

interface OllamaSettingsProps {
  config: OllamaConfig;
  onConfigChange: (config: OllamaConfig) => void;
  onTestConnection: () => Promise<boolean>;
  isConnected: boolean;
}

export const OllamaSettings: React.FC<OllamaSettingsProps> = ({
  config,
  onConfigChange,
  onTestConnection,
  isConnected,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await onTestConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult(false);
    } finally {
      setIsTesting(false);
    }
  };

  const updateConfig = (key: keyof OllamaConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Ollama Settings</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? 'Hide' : 'Show'} settings
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ollama URL
              </label>
              <input
                type="url"
                value={config.baseUrl}
                onChange={(e) => updateConfig('baseUrl', e.target.value)}
                placeholder="http://localhost:11434"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                value={config.model}
                onChange={(e) => updateConfig('model', e.target.value)}
                placeholder="mistral-small"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature
              </label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature || 0.7}
                onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Controls randomness (0 = deterministic, 2 = very random)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                max="4096"
                value={config.maxTokens || 1000}
                onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value))}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum response length
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>

            {testResult !== null && (
              <div className={`text-sm flex items-center gap-1 ${
                testResult ? 'text-green-600' : 'text-red-600'
              }`}>
                {testResult ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    Connection successful
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    Connection failed
                  </>
                )}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions</h4>
            <ol className="text-xs text-blue-800 space-y-1">
              <li>1. Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="underline">ollama.ai</a></li>
              <li>2. Pull the mistral-small model: <code className="bg-blue-100 px-1 rounded">ollama pull mistral-small</code></li>
              <li>3. Start Ollama: <code className="bg-blue-100 px-1 rounded">ollama serve</code></li>
              <li>4. Test the connection using the button above</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}; 