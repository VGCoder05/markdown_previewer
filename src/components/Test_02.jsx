import React, { useState, useRef } from "react"
import MarkdownPreview from "./MarkdownPreview"

const Sidebar = ({ headings, onHeadingClick, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed md:static z-40 md:z-auto top-0 left-0 h-full bg-gray-50 border-r border-gray-200 overflow-y-auto transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:w-[35%]  md:max-w-[250px]`}
      >
        <div className="p-4">
          <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 ">
            Table of Contents
          </h2>
          <span className={`cursor-pointer font-extrabold text-base ${isOpen ? "block": "hidden"}`} onClick={onClose}>X</span>
          </div>
          {headings.length === 0 ? (
            <p className="text-sm text-gray-500">No headings found</p>
          ) : (
            <nav className="space-y-1">
              {headings.map(heading => (
                <button
                  key={heading.id}
                  onClick={() => {
                    onHeadingClick(heading.id)
                    onClose?.()
                  }}
                  className={`block  text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-200 hover:text-gray-900 cursor-pointer ${
                    heading.level === 1
                      ? "font-semibold text-gray-900"
                      : heading.level === 2
                      ? "font-medium text-gray-700 ml-4"
                      : heading.level === 3
                      ? "text-gray-600 ml-8"
                      : heading.level === 4
                      ? "text-gray-600 ml-12"
                      : heading.level === 5
                      ? "text-gray-600 ml-16"
                      : "text-gray-600 ml-20"
                  }`}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </>
  )
}

const FileUpload = ({ setFileName, onFileUpload }) => {
  const fileInputRef = useRef(null)

  const handleFileChange = event => {
    const file = event.target.files?.[0]
    if (file && (file.type === "text/markdown" || file.name.endsWith(".md"))) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target?.result
        onFileUpload(content)
      }
      reader.readAsText(file)
    } else if (file) {
      alert("Please upload a valid markdown file (.md)")
    }
  }

  const handleDrop = event => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && (file.type === "text/markdown" || file.name.endsWith(".md"))) {
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target?.result
        onFileUpload(content)
      }
      reader.readAsText(file)
    } else if (file) {
      alert("Please upload a valid markdown file (.md)")
    }
  }

  const handleDragOver = event => {
    event.preventDefault()
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <svg
          className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
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
        <p className="text-gray-600 text-sm sm:text-base">
          Drag & drop your markdown file here
        </p>
        <p className="text-gray-400 text-xs sm:text-sm">or click to browse files</p>
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

const Header = ({ fileName, onReset, onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Markdown Previewer
        </h1>
        {fileName && (
          <div className="flex items-center space-x-2">
            <span>/</span>
            <span className="text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none">
              {fileName}
            </span>
          </div>
        )}
      </div>
      {fileName && (
        <button
          onClick={onReset}
          className="text-sm sm:text-base px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
        >
          {/* Upload New File */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>
        </button>
      )}
    </header>
  )
}

export default function MarkdownPreviewer() {
  const [markdownContent, setMarkdownContent] = useState("")
  const [headings, setHeadings] = useState([])
  const [fileName, setFileName] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const extractHeadings = content => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const extractedHeadings = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = `h${level}-${text.replace(/\s+/g, "-").toLowerCase()}`
      extractedHeadings.push({ id, text, level })
    }

    return extractedHeadings
  }

  const handleFileUpload = content => {
    setMarkdownContent(content)
    const extractedHeadings = extractHeadings(content)
    setHeadings(extractedHeadings)
  }

  const handleHeadingClick = id => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleReset = () => {
    setMarkdownContent("")
    setHeadings([])
    setFileName("")
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header
        fileName={fileName}
        onReset={handleReset}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {markdownContent ? (
          <>
            <Sidebar
              headings={headings}
              onHeadingClick={handleHeadingClick}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <div className="flex-1 overflow-y-auto">
              <MarkdownPreview content={markdownContent} headings={headings} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="max-w-lg w-full">
              <FileUpload
                onFileUpload={content => {
                  handleFileUpload(content)
                }}
                setFileName={setFileName}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
