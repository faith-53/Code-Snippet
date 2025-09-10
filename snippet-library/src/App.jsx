import { useEffect, useMemo, useState } from 'react'
import './App.css'
import SnippetCard from './components/SnippetCard'
import snippetsData from './snippets.json'

function App() {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('All')
  const [activeTags, setActiveTags] = useState([])
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('favorites')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const languages = useMemo(() => {
    const set = new Set(snippetsData.map(s => s.language))
    return ['All', ...Array.from(set).sort()]
  }, [])

  const tags = useMemo(() => {
    const set = new Set(snippetsData.flatMap(s => s.tags || []))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return snippetsData.filter(s => {
      const matchesQuery = !q ||
        s.title.toLowerCase().includes(q) ||
        s.language.toLowerCase().includes(q) ||
        (s.tags || []).some(t => t.toLowerCase().includes(q)) ||
        s.code.toLowerCase().includes(q)

      const matchesLang = language === 'All' || s.language === language
      const matchesTags = activeTags.length === 0 || activeTags.every(t => s.tags?.includes(t))
      const matchesFav = !onlyFavorites || favorites.includes(s.id)
      return matchesQuery && matchesLang && matchesTags && matchesFav
    })
  }, [query, language, activeTags, favorites, onlyFavorites])

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const clearFilters = () => {
    setQuery('')
    setLanguage('All')
    setActiveTags([])
    setOnlyFavorites(false)
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  useEffect(() => {
    try { localStorage.setItem('favorites', JSON.stringify(favorites)) } catch {}
  }, [favorites])

  return (
    <div className="container">
      <header className="topbar">
        <h1 className="title">Code Snippet Library</h1>
        <p className="subtitle">Search snippets by keyword, language, or tag. Tap to copy.</p>
        <div className="controls">
          <input
            className="search"
            type="search"
            placeholder="Search by keyword, tag, or code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="select" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
            <input type="checkbox" checked={onlyFavorites} onChange={(e) => setOnlyFavorites(e.target.checked)} />
            Favorites only
          </label>
        </div>

        <div className="chips" aria-label="Tag filters">
          {tags.map((t) => (
            <button
              key={t}
              className={`chip ${activeTags.includes(t) ? 'active' : ''}`}
              onClick={() => toggleTag(t)}
            >
              {t}
            </button>
          ))}
          <button className="chip clear" onClick={clearFilters}>Clear</button>
        </div>
      </header>

      <main className="grid" role="list">
        {filtered.length === 0 ? (
          <p className="muted">No snippets match your filters.</p>
        ) : (
          filtered.map(snippet => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              isFavorite={favorites.includes(snippet.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </main>

      <footer className="footer">
        <small>Tips: Use the search to match titles, tags, language, and code.</small>
      </footer>
    </div>
  )
}

export default App
