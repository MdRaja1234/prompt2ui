import React, { useEffect, useRef } from 'react';
import { getIframeSrcDoc } from '../utils/sandbox';
import { compileCode } from '../utils/compiler';

export function PreviewPanel({ code, isGenerating }) {
  const iframeRef = useRef(null);

  // Compile and update iframe when code changes
  useEffect(() => {
    const updateIframe = () => {
      if (!iframeRef.current) return;
      try {
        if (!code.trim()) return;
        // Transpile JSX/ES6 to vanilla JS
        const compiled = compileCode(code);
        iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_CODE', code: compiled }, '*');
      } catch (err) {
        // Silent catch to avoid spamming the user on intermediate syntax errors while typing
        console.error('Babel transform error', err);
      }
    };

    const timer = setTimeout(updateIframe, 500); // debounce compile
    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className="w-full md:w-1/2 flex-1 md:flex-none min-h-[500px] md:min-h-0 md:h-full flex flex-col bg-white overflow-hidden relative">
       <div className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-300 text-xs font-semibold text-gray-500 uppercase tracking-wider shadow-sm z-10">
          Live Preview
        </div>
       
       {/* Background pattern for visual depth - panning slowly */}
       <div className="absolute inset-0 top-9 opacity-[0.03] pointer-events-none animate-pan" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
       
       {/* Animated floating blobs (Light theme) */}
       <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400/50 rounded-full mix-blend-multiply filter blur-[60px] animate-blob pointer-events-none z-0"></div>
       <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400/50 rounded-full mix-blend-multiply filter blur-[60px] animate-blob-reverse pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>
       
       {/* Generating Animation Overlay */}
       {isGenerating && (
         <div className="absolute inset-0 top-9 z-20 pointer-events-none animate-pulse transition-opacity duration-300">
            <div className="absolute inset-0 border-[3px] border-blue-400/40 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]"></div>
         </div>
       )}

       <iframe 
          ref={iframeRef}
          srcDoc={getIframeSrcDoc()}
          sandbox="allow-scripts allow-same-origin"
          className="w-full flex-1 border-none bg-transparent relative z-0 transition-opacity duration-300"
          title="Preview"
       />
    </div>
  );
}
