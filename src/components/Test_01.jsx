import React, { useState, useRef, useEffect } from "react"
import { marked } from "marked"

const FileUploader = ({ onFileUpload }) => {
  const fileInputRef = useRef(null)

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = event => {
      const content = event.target?.result
      onFileUpload(content)
    }
    reader.readAsText(file)
  }

  const handleDrop = e => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = event => {
      const content = event.target?.result
      onFileUpload(content)
    }
    reader.readAsText(file)
  }

  const handleDragOver = e => {
    e.preventDefault()
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <p className="text-gray-600">Drag & drop your markdown file here</p>
        <p className="text-gray-400 text-sm">or click to browse files</p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".md,.markdown,text/markdown"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

const Sidebar = ({ headings, activeHeading, onHeadingClick }) => {
  return (
    <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Table of Contents
        </h2>
      </div>
      <div className="py-2">
        {headings.length === 0 ? (
          <p className="text-gray-500 text-sm px-4 py-2">No headings found</p>
        ) : (
          headings.map(heading => (
            <div
              key={heading.id}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                activeHeading === heading.id
                  ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                  : "hover:bg-gray-100"
              }`}
              style={{ paddingLeft: `${heading.level * 12 + 16}px` }}
              onClick={() => onHeadingClick(heading.id)}
            >
              <span className="font-medium">{heading.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const MarkdownPreview = ({ content }) => {
  const [htmlContent, setHtmlContent] = useState("")

  useEffect(() => {
    if (content) {
      marked.setOptions({ breaks: true, gfm: true })
      setHtmlContent(marked(content))
    } else {
      setHtmlContent(
        '<p class="text-gray-500">Upload a markdown file to preview its content</p>'
      )
    }
  }, [content])

  return (
    <div
      className="prose max-w-none p-6 overflow-y-auto h-full"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

const MarkdownPreviewer = () => {
  const [markdownContent, setMarkdownContent] = useState("")
  const [headings, setHeadings] = useState([])
  const [activeHeading, setActiveHeading] = useState("")

  useEffect(() => {
    if (!markdownContent) {
      setHeadings([])
      return
    }

    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const foundHeadings = []
    let match

    while ((match = headingRegex.exec(markdownContent)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")

      foundHeadings.push({ id, text, level })
    }

    setHeadings(foundHeadings)
  }, [markdownContent])

  const handleFileUpload = content => {
    setMarkdownContent(content)
  }

  const handleHeadingClick = id => {
    setActiveHeading(id)
    // Scroll to heading in preview (optional enhancement)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-800">Markdown Previewer</h1>
        <p className="text-gray-600">
          Upload a markdown file to see its content and navigate through
          headings
        </p>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="w-full md:w-1/3">
          <FileUploader onFileUpload={handleFileUpload} />

          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              How to use
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Upload a markdown (.md) file using the area above</li>
              <li>Headings will automatically appear in the sidebar</li>
              <li>Click on headings to navigate through the document</li>
              <li>Preview renders in real-time as you upload files</li>
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <MarkdownPreview content={markdownContent} />
          </div>
        </div>

        <div className="w-full md:w-64 bg-white rounded-lg shadow overflow-hidden">
          <Sidebar
            headings={headings}
            activeHeading={activeHeading}
            onHeadingClick={handleHeadingClick}
          />
        </div>
      </main>

      <footer className="py-4 text-center text-gray-500 text-sm border-t border-gray-200 mt-4">
        Markdown Previewer • Drag and drop your markdown files
      </footer>
    </div>
  )
}

export default MarkdownPreviewer
