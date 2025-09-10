import { useEffect, useRef, useState } from 'react';

export default function SnippetCard({ snippet, isFavorite, onToggleFavorite }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  useEffect(() => {
    // Highlight on mount/update
    if (window.Prism && codeRef.current) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [snippet.code, snippet.language]);

  return (
    <article className="card" data-lang={snippet.language}>
      <header className="card-header">
        <h3 className="card-title">{snippet.title}</h3>
        <span className="badge">{snippet.language}</span>
      </header>
      <div className="tag-row">
        {snippet.tags?.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <pre className="code-block">
        <code ref={codeRef} className={`language-${(snippet.language || '').toLowerCase()}`}>
          {snippet.code}
        </code>
      </pre>
      <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}>
        <button className="copy-btn" onClick={handleCopy} aria-label="Copy code">
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button className="copy-btn" onClick={() => onToggleFavorite?.(snippet.id)} aria-label="Toggle favorite">
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
    </article>
  );
}


