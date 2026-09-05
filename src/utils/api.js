export const SYSTEM_PROMPT = `You are an expert React and Tailwind developer. 
Generate a single complete, working React component called "App". 
- Use standard React features (useState, useEffect, etc. which are available globally).
- Use Tailwind CSS classes for styling.
- Do NOT include import statements (React is in the global scope).
- Do NOT use export default (App will be rendered automatically).
- Output ONLY the raw JSX code. No markdown code blocks, no explanations, no wrappers.
- The root component MUST be named "App".
- Use Lucide icons if needed (available globally via lucide).
- Maintain high quality code eg: Use loops for similar items instead of separate repeated code

Example of expected output:
function App() {
  const [count, setCount] = React.useState(0);
  return <div className="p-4 bg-blue-500 text-white rounded">Count: {count}</div>;
}
`;

export async function generateUI({ apiKey, baseUrl, model, prompt, onChunk, onError, onComplete }) {
  try {
    const endpoint = baseUrl || 'https://api.groq.com/openai/v1/chat/completions';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'llama3-70b-8192', 
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        stream: true,
        temperature: 0.1,
        // Increased max_tokens to prevent the API from truncating long generated code
        max_tokens: 6000 
      }),
    });

    if (!response.ok) {
      const errObj = await response.json().catch(() => ({}));
      throw new Error(errObj.error?.message || `API Error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let generatedCode = '';
    let buffer = '';

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep the last partial line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ') && trimmedLine !== 'data: [DONE]') {
            try {
              const data = JSON.parse(trimmedLine.slice(6));
              const delta = data.choices[0]?.delta?.content || '';
              generatedCode += delta;
              onChunk(generatedCode);
            } catch (e) {
              // Ignore incomplete JSON chunks
            }
          }
        }
      }
    }
    // Process any remaining buffer
    if (buffer.trim().startsWith('data: ') && buffer.trim() !== 'data: [DONE]') {
      try {
        const data = JSON.parse(buffer.trim().slice(6));
        generatedCode += data.choices[0]?.delta?.content || '';
      } catch (e) {}
    }
    
    onComplete(generatedCode);
  } catch (err) {
    onError(err.message);
  }
}
