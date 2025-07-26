import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from './ThemeContext';

const MarkdownRenderer = ({ 
  content, 
  className = "",
  allowHtml = false,
  components = {} 
}) => {
  const { theme } = useTheme();
  
  const customComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={theme === 'dark' ? oneDark : oneLight}
          language={match[1]}
          PreTag="div"
          className="rounded-lg my-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code 
          className={`${className} px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono`} 
          {...props}
        >
          {children}
        </code>
      );
    },
    
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6">
        {children}
      </h1>
    ),
    
    h2: ({ children }) => (
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-5">
        {children}
      </h2>
    ),
    
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">
        {children}
      </h3>
    ),
    
    p: ({ children }) => (
      <p className="text-gray-900 dark:text-white mb-3 leading-relaxed">
        {children}
      </p>
    ),
    
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-900 dark:text-white mb-3 ml-4 space-y-1">
        {children}
      </ul>
    ),
    
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-900 dark:text-white mb-3 ml-4 space-y-1">
        {children}
      </ol>
    ),
    
    li: ({ children }) => (
      <li className="text-gray-900 dark:text-white leading-relaxed">
        {children}
      </li>
    ),
    
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
        <div className="text-gray-700 dark:text-gray-300 italic">
          {children}
        </div>
      </blockquote>
    ),
    
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
    
    em: ({ children }) => (
      <em className="italic text-gray-800 dark:text-gray-200">
        {children}
      </em>
    ),
    
    a: ({ href, children }) => (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
      >
        {children}
      </a>
    ),
    
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg">
          {children}
        </table>
      </div>
    ),
    
    thead: ({ children }) => (
      <thead className="bg-gray-50 dark:bg-gray-800">
        {children}
      </thead>
    ),
    
    tbody: ({ children }) => (
      <tbody className="bg-white dark:bg-gray-900">
        {children}
      </tbody>
    ),
    
    tr: ({ children }) => (
      <tr className="border-b border-gray-200 dark:border-gray-700">
        {children}
      </tr>
    ),
    
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-600 last:border-r-0">
        {children}
      </th>
    ),
    
    td: ({ children }) => (
      <td className="px-4 py-2 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 last:border-r-0">
        {children}
      </td>
    ),
    
    hr: () => (
      <hr className="my-6 border-gray-300 dark:border-gray-600" />
    ),
    
    ...components
  };

  return (
    <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={customComponents}
        rehypePlugins={allowHtml ? [] : undefined}
        skipHtml={!allowHtml}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;