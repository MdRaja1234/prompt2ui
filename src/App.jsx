import React, { useState, useEffect } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { generateUI } from './utils/api';

const DEFAULT_CODE = `function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Live AI Sandbox</h1>
        <p className="text-gray-500 text-lg">Enter a prompt on the left to generate UI.</p>
      </div>
    </div>
  );
}`;

function cleanMarkdown(codeStr) {
  let cleanCode = codeStr;
  if (cleanCode.startsWith('```jsx')) {
    cleanCode = cleanCode.replace('```jsx\n', '');
  } else if (cleanCode.startsWith('```javascript')) {
    cleanCode = cleanCode.replace('```javascript\n', '');
  } else if (cleanCode.startsWith('```')) {
    cleanCode = cleanCode.replace('```\n', '');
  }
  
  if (cleanCode.endsWith('```')) {
      cleanCode = cleanCode.slice(0, -3);
  }
  return cleanCode.trim();
}

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('groq_api_key') || '');
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem('ai_base_url') || 'https://api.groq.com/openai/v1/chat/completions');
  const [model, setModel] = useState(() => localStorage.getItem('ai_model') || 'llama3-70b-8192');
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Save settings to local storage
  useEffect(() => {
    localStorage.setItem('groq_api_key', apiKey);
    localStorage.setItem('ai_base_url', baseUrl);
    localStorage.setItem('ai_model', model);
  }, [apiKey, baseUrl, model]);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please provide an API Key first.');
      return;
    }
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCode(''); // clear code

    await generateUI({
      apiKey,
      baseUrl,
      model,
      prompt,
      onChunk: (partialCode) => {
        setCode(cleanMarkdown(partialCode));
      },
      onError: (errMsg) => {
        setError(errMsg);
        setIsGenerating(false);
      },
      onComplete: (finalCode) => {
        setCode(cleanMarkdown(finalCode));
        setIsGenerating(false);
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-900 text-white overflow-y-auto md:overflow-hidden font-sans">
      <EditorPanel 
        apiKey={apiKey} setApiKey={setApiKey}
        baseUrl={baseUrl} setBaseUrl={setBaseUrl}
        model={model} setModel={setModel}
        prompt={prompt} setPrompt={setPrompt}
        code={code} setCode={setCode}
        isGenerating={isGenerating} error={error}
        onGenerate={handleGenerate}
      />
      <PreviewPanel code={code} isGenerating={isGenerating} />
    </div>
  );
}

export default App;
