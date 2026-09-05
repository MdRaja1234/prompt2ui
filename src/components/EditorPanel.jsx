import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Play, Loader2, Settings, Code, Layout } from 'lucide-react';

export function EditorPanel({
  apiKey, setApiKey,
  baseUrl, setBaseUrl,
  model, setModel,
  prompt, setPrompt,
  code, setCode,
  isGenerating, error, onGenerate
}) {
  return (
    <div className="w-1/2 flex flex-col border-r border-gray-700 relative overflow-hidden bg-gray-900">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/40 rounded-full mix-blend-screen filter blur-[80px] animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-80 h-80 bg-purple-500/40 rounded-full mix-blend-screen filter blur-[80px] animate-blob-reverse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-screen filter blur-[80px] animate-blob pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Content wrapper with backdrop blur to let blobs shine through gently */}
      <div className="flex-1 flex flex-col relative z-10 backdrop-blur-[2px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-blue-400" />
            <h1 className="font-semibold text-lg tracking-wide">Prompt-to-UI</h1>
            <div className="ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Settings</span>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="p-4 bg-gray-800/80 backdrop-blur-md border-b border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="group">
             <label className="text-xs text-gray-400 mb-1 block group-focus-within:text-blue-400 transition-colors">API Endpoint</label>
             <input 
               type="text" 
               value={baseUrl}
               onChange={(e) => setBaseUrl(e.target.value)}
               placeholder="https://api.groq.com/..."
               className="w-full px-2 py-1.5 bg-gray-900/90 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:border-gray-500 focus:-translate-y-[1px] focus:shadow-lg text-gray-200 placeholder:text-gray-600"
             />
          </div>
          <div className="group">
             <label className="text-xs text-gray-400 mb-1 block group-focus-within:text-blue-400 transition-colors">Model Name</label>
             <input 
               type="text" 
               value={model}
               onChange={(e) => setModel(e.target.value)}
               placeholder="llama3-70b-8192"
               className="w-full px-2 py-1.5 bg-gray-900/90 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:border-gray-500 focus:-translate-y-[1px] focus:shadow-lg text-gray-200 placeholder:text-gray-600"
             />
          </div>
          <div className="group">
             <label className="text-xs text-gray-400 mb-1 block group-focus-within:text-blue-400 transition-colors">API Key</label>
             <input 
               type="password" 
               placeholder="Your API Key"
               value={apiKey}
               onChange={(e) => setApiKey(e.target.value)}
               className="w-full px-2 py-1.5 bg-gray-900/90 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:border-gray-500 focus:-translate-y-[1px] focus:shadow-lg text-gray-200 placeholder:text-gray-600"
             />
          </div>
        </div>

        {/* Prompt Input */}
        <div className="p-4 bg-gray-800/80 backdrop-blur-md border-b border-gray-700 shadow-sm z-10">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  onGenerate();
               }
            }}
            placeholder="Describe the UI you want to build (e.g. 'A responsive pricing card')\nPress Ctrl+Enter to generate"
            className="w-full h-24 p-3 bg-gray-900/90 border border-gray-600 rounded text-sm text-gray-200 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-3 transition-all duration-200 hover:border-gray-500 focus:-translate-y-[2px] focus:shadow-lg placeholder:text-gray-500"
          />
          <button 
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] shadow-sm backdrop-blur-md"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {isGenerating ? 'Generating UI...' : 'Generate UI'}
          </button>
          
          {error && (
            <div className="mt-3 text-red-400 text-sm p-3 bg-red-900/40 backdrop-blur-md rounded border border-red-900/50 flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#282c34]/90 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50 text-xs font-medium text-gray-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" /> Live Code (Editable)
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            <CodeMirror
              value={code}
              height="100%"
              extensions={[javascript({ jsx: true })]}
              onChange={(value) => setCode(value)}
              theme="dark"
              className="text-sm h-full bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
