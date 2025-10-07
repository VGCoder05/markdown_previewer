import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';

// import the languages want to support
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-bash';

const CodeBlock = ({ children, className }) => {
  const ref = useRef(null);
  
  // Find the language from the className (e.g., "language-js")
  const language = className?.split('-')[1] || 'javascript';

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, [children]); // Re-run highlighting when the code content changes

  return (
    <pre className={`language-${language}`}>
      <code ref={ref} className={`language-${language}`}>
        {children}
      </code>
    </pre>
  );
};

export default CodeBlock;

{/* <CodeBlock children={} className={} /> */}