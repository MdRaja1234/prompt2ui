export const getIframeSrcDoc = () => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin="anonymous"></script>
  <script>window.react = window.React;</script>
  <script src="https://cdn.tailwindcss.com" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/lucide@latest" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/lucide-react@latest/dist/umd/lucide-react.min.js" crossorigin="anonymous"></script>
  <script>
    if (window.LucideReact) {
      const REACT_FORWARD_REF_TYPE = window.React.forwardRef(() => null)['$$typeof'];
      
      const renderIconModule = function(props, ref) {
        const name = props && (props.name || props.icon);
        if (!name) return null;
        const cap = typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name;
        const Comp = window.LucideReact[cap];
        if (Comp) return window.React.createElement(Comp, Object.assign({}, props, {ref: ref}));
        return null;
      };

      // Wrap every individual icon so it can be called as a function (e.g., lucide.Sun())
      const makeCallable = function(obj) {
        for (const key in obj) {
          const original = obj[key];
          if (original && original['$$typeof'] === REACT_FORWARD_REF_TYPE) {
            const callable = function(props) {
              return window.React.createElement(original, props);
            };
            callable['$$typeof'] = REACT_FORWARD_REF_TYPE;
            callable.render = original.render;
            Object.assign(callable, original);
            obj[key] = callable;
          }
        }
      };
      makeCallable(window.LucideReact);
      if (window.LucideReact.icons) makeCallable(window.LucideReact.icons);

      // Make the module object itself a valid React component
      window.LucideReact['$$typeof'] = REACT_FORWARD_REF_TYPE;
      window.LucideReact.render = renderIconModule;
      if (window.LucideReact.icons) {
        window.LucideReact.icons['$$typeof'] = REACT_FORWARD_REF_TYPE;
        window.LucideReact.icons.render = renderIconModule;
      }
      
      const vanillaLucide = window.lucide || {};
      window.lucide = new Proxy(vanillaLucide, {
        get: function(target, prop) {
          if (prop === '$$typeof') return REACT_FORWARD_REF_TYPE;
          if (prop === 'render') return renderIconModule;
          if (prop === 'createIcons') return target[prop];
          if (prop === 'icons') return window.LucideReact.icons;
          if (window.LucideReact[prop]) return window.LucideReact[prop];
          const cap = typeof prop === 'string' ? prop.charAt(0).toUpperCase() + prop.slice(1) : prop;
          if (window.LucideReact[cap]) return window.LucideReact[cap];
          return target[prop];
        }
      });
    }
  </script>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="global-error" style="display: none; color: red; padding: 20px; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: relative;"></div>
  <div id="root"></div>
  <script>
    window.require = function(module) {
      if (module === 'react') return window.React;
      if (module === 'react-dom') return window.ReactDOM;
      if (module === 'lucide-react' || module === 'lucide') return window.LucideReact;
      return null;
    };
    window.exports = {};
    window.module = { exports: window.exports };

    window.addEventListener('error', function(e) {
      if (e.message === 'Script error.') return;
      const errDiv = document.getElementById('global-error');
      errDiv.style.display = 'block';
      errDiv.textContent += 'Runtime Error:\\n' + e.message + '\\n\\n';
    });

    class ErrorBoundary extends window.React.Component {
      constructor(props) { super(props); this.state = { error: null }; }
      static getDerivedStateFromError(error) { return { error }; }
      render() {
        if (this.state.error) {
          return window.React.createElement('div', 
            { style: { color: 'red', padding: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' } }, 
            'Render Error:\\n' + this.state.error.message
          );
        }
        return this.props.children;
      }
    }

    window.addEventListener("message", (event) => {
      if (event.data.type === 'UPDATE_CODE') {
        const errDiv = document.getElementById('global-error');
        errDiv.style.display = 'none';
        errDiv.textContent = '';
        
        try {
          const { code } = event.data;
          
          const evaluate = new Function("require", "exports", "module", "React", "ReactDOM",
            code + "\\nreturn typeof App !== 'undefined' ? App : null;"
          );
          
          const App = evaluate(window.require, window.exports, window.module, window.React, window.ReactDOM);
          
          if (App) {
            if (!window.rootContainer) {
               window.rootContainer = window.ReactDOM.createRoot(document.getElementById('root'));
            }
            window.rootContainer.render(
              window.React.createElement(ErrorBoundary, null, 
                window.React.createElement(App)
              )
            );
          } else {
            throw new Error("App component was not found. Please ensure you define 'function App() { ... }'.");
          }
        } catch (err) {
           errDiv.style.display = 'block';
           errDiv.textContent = 'Evaluation Error:\\n' + err.message;
           
           if (window.rootContainer) {
               try { window.rootContainer.unmount(); } catch(e) {}
               window.rootContainer = null;
           }
           document.getElementById('root').innerHTML = '';
        }
      }
    });
  </script>
</body>
</html>
`;
