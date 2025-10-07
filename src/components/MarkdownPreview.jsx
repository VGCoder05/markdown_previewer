// import styles from './style/MarkdownPreview.module.css';
import Prism from 'prismjs';
import React, { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import CodeBlock from './CodeBlock';

const MarkdownPreview = ({ content, headings }) => {
    const [activeHeading, setActiveHeading] = useState("")
    const headingRefs = useRef({})
    Prism.highlightAll();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const heading of headings) {
        const element = headingRefs.current[heading.id]
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveHeading(heading.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  const components = {
    h1: ({ children, ...props }) => {
      const id = `h1-${children
        ?.toString()
        .replace(/\s+/g, "-")
        .toLowerCase() || ""}`
      return (
        <h1
          ref={el => (headingRefs.current[id] = el)}
          id={id}
          {...props}
          className={`text-3xl font-bold mt-8 mb-4 text-gray-900 scroll-mt-20 ${
            activeHeading === id ? "ring-2 ring-blue-500 rounded" : ""
          }`}
        >
          {children}
        </h1>
      )
    },
    h2: ({ children, ...props }) => {
      const id = `h2-${children
        ?.toString()
        .replace(/\s+/g, "-")
        .toLowerCase() || ""}`
      return (
        <h2
          ref={el => (headingRefs.current[id] = el)}
          id={id}
          {...props}
          className={`text-2xl font-semibold mt-6 mb-3 text-gray-800 scroll-mt-20 ${
            activeHeading === id ? "ring-2 ring-blue-500 rounded" : ""
          }`}
        >
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }) => {
      const id = `h3-${children
        ?.toString()
        .replace(/\s+/g, "-")
        .toLowerCase() || ""}`
      return (
        <h3
          ref={el => (headingRefs.current[id] = el)}
          id={id}
          {...props}
          className={`text-xl font-medium mt-4 mb-2 text-gray-700 scroll-mt-20 ${
            activeHeading === id ? "ring-2 ring-blue-500 rounded" : ""
          }`}
        >
          {children}
        </h3>
      )
    },
    h4: ({ children, ...props }) => {
      const id = `h4-${children
        ?.toString()
        .replace(/\s+/g, "-")
        .toLowerCase() || ""}`
      return (
        <h4
          ref={el => (headingRefs.current[id] = el)}
          id={id}
          {...props}
          className={`text-lg font-medium mt-3 mb-2 text-gray-700 scroll-mt-20 ${
            activeHeading === id ? "ring-2 ring-blue-500 rounded" : ""
          }`}
        >
          {children}
        </h4>
      )
    },
    h5: ({ children, ...props }) => {
      const id = `h5-${children
        ?.toString()
        .replace(/\s+/g, "-")
        .toLowerCase() || ""}`
      return (
        <h5
          ref={el => (headingRefs.current[id] = el)}
          id={id}
          {...props}
          className={`text-base font-medium mt-2 mb-1 text-gray-700 scroll-mt-20 ${
            activeHeading === id ? "ring-2 ring-blue-500 rounded" : ""
          }`}
        >
          {children}
        </h5>
      )
    },
    h6: ({ children, ...props }) => {
      const id = `h6-${children
        ?.toString()
        .replace(/\s+/g, "-")
        .toLowerCase() || ""}`
      return (
        <h6
          ref={el => (headingRefs.current[id] = el)}
          id={id}
          {...props}
          className={`text-sm font-medium mt-2 mb-1 text-gray-600 scroll-mt-20 ${
            activeHeading === id ? "ring-2 ring-blue-500 rounded" : ""
          }`}
        >
          {children}
        </h6>
      )
    },
    p: ({ children, ...props }) => (
      <p {...props} className="mb-4 text-gray-700 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul
        {...props}
        className="list-disc list-inside mb-4 text-gray-700 space-y-1"
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        {...props}
        className="list-decimal list-inside mb-4 text-gray-700 space-y-1"
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li {...props} className="ml-4">
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        {...props}
        className="border-l-4 border-gray-300 pl-4 py-2 mb-4 bg-gray-50 italic text-gray-600"
      >
        {children}
      </blockquote>
    ),
    pre: ({ node, children, ...props }) => {
  // This component will render the container for code blocks.
  // The 'children' will be the <code> element rendered by the 'code' component below.
  const match = /language-(\w+)/.exec(children.props.className || '');
  return (
    <CodeBlock children={children.props.children}  className={children.props.className} />

  );
},
code: ({ node, className, children, ...props }) => {
  // The 'className' prop will be something like "language-js" for code blocks
  // and undefined for inline code. We can use this to differentiate.
  const match = /language-(\w+)/.exec(className || '');
  
  // If there is NO match, it's an inline code snippet.
  // This replaces the unreliable `if (inline)` check.
  if (!match) {
    // It's not wrapped in a <pre> tag.
    // This is for inline code, like `my-variable`.
    return (
      <code
      className="w-max bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-600"
      {...props}
      >
        {children}
      </code>
    );
  }
  
  // This is for a code block. 
  // This <code> element will be a child of the <pre> element defined above.

  // If there IS a match, it's a code block. 
  // This <code> element will be a child of the <pre> element defined above.
  // We pass the original className to preserve the language for syntax highlighters.

  return (
    <code {...props} className={className}    >
      {children}
    </code>
  );
},
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto mb-4">
        <table
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        {...props}
        className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left"
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td {...props} className="border border-gray-300 px-4 py-2">
        {children}
      </td>
    )
  }
  

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
export default MarkdownPreview;
