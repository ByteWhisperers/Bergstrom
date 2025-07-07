
import React from 'react';

const SimpleRichEditorStyles: React.FC = () => {
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Estilos para o editor de texto rico */
      .prose [contenteditable] h1,
      .prose h1 {
        font-size: 2em !important;
        font-weight: 700 !important;
        margin: 0.67em 0 !important;
        line-height: 1.2 !important;
        color: #1f2937 !important;
      }
      
      .prose [contenteditable] h2,
      .prose h2 {
        font-size: 1.5em !important;
        font-weight: 600 !important;
        margin: 0.83em 0 !important;
        line-height: 1.3 !important;
        color: #374151 !important;
      }
      
      .prose [contenteditable] h3,
      .prose h3 {
        font-size: 1.17em !important;
        font-weight: 600 !important;
        margin: 1em 0 !important;
        line-height: 1.4 !important;
        color: #4b5563 !important;
      }
      
      .prose [contenteditable] h4,
      .prose h4 {
        font-size: 1em !important;
        font-weight: 600 !important;
        margin: 1.33em 0 !important;
        line-height: 1.5 !important;
        color: #6b7280 !important;
      }
      
      .prose [contenteditable] p,
      .prose p {
        margin: 1em 0 !important;
        line-height: 1.6 !important;
        color: #374151 !important;
      }
      
      .prose [contenteditable] ul,
      .prose ul {
        list-style-type: disc !important;
        margin: 1em 0 !important;
        padding-left: 2em !important;
      }
      
      .prose [contenteditable] ol,
      .prose ol {
        list-style-type: decimal !important;
        margin: 1em 0 !important;
        padding-left: 2em !important;
      }
      
      .prose [contenteditable] li,
      .prose li {
        margin: 0.5em 0 !important;
        line-height: 1.6 !important;
      }
      
      .prose [contenteditable] strong,
      .prose strong {
        font-weight: 700 !important;
      }
      
      .prose [contenteditable] em,
      .prose em {
        font-style: italic !important;
      }
      
      .prose [contenteditable] u,
      .prose u {
        text-decoration: underline !important;
      }

      /* Hover effect para imagens no editor */
      .prose [contenteditable] img:hover {
        box-shadow: 0 0 0 2px #3b82f6 !important;
      }

      /* Cursor pointer para imagens no editor */
      .prose [contenteditable] img {
        cursor: pointer !important;
        transition: box-shadow 0.2s ease !important;
      }
      
      /* Garantir que o editor tenha altura mínima e scroll */
      [contenteditable] {
        min-height: 300px;
        max-height: 600px;
        overflow-y: auto;
        word-wrap: break-word;
      }
      
      /* Foco no editor */
      [contenteditable]:focus {
        outline: none !important;
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
      }
    `;
    
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return null;
};

export default SimpleRichEditorStyles;
