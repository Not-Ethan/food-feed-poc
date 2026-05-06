import feed from './data/feed.json'
import './App.css'

const featuredItems = feed.items
  .filter((item) => item.image)
  .sort((a, b) => a.sortScore - b.sortScore)
  .slice(0, 24)

function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Proof of concept • scraped inventory</p>
          <h1>Scroll food. Tap out to order.</h1>
          <p className="lede">
            A vertical discovery feed powered by scraped Uber Eats menu items and deep links.
            No checkout, no payments — just discovery and routing.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Platform</span>
            <strong>{feed.platform}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Stores scraped</span>
            <strong>{feed.sourceStores.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Items loaded</span>
            <strong>{feed.items.length}</strong>
          </div>
        </div>

        <div className="source-list">
          {feed.sourceStores.map((store) => (
            <a key={store.orderUrl} className="source-pill" href={store.orderUrl} target="_blank" rel="noreferrer">
              {store.restaurant} • {store.city}
            </a>
          ))}
        </div>
      </header>

      <section className="phone-frame" aria-label="Vertical food discovery feed">
        <div className="feed-header">
          <div>
            <p className="feed-title">Discover now</p>
            <span className="feed-subtitle">Dish-first feed • external checkout</span>
          </div>
          <div className="pill">{featuredItems.length} cards</div>
        </div>

        <div className="feed-scroll">
          {featuredItems.map((item) => (
            <article className="food-card" key={item.id}>
              <div className="media" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="media-overlay" />
                <div className="media-copy">
                  <div className="pill-row">
                    <span className="delivery-pill">{item.platform}</span>
                    <span className="delivery-pill muted">{item.city}</span>
                  </div>
                  <div className="dish-type">{item.cuisine}</div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
              </div>

              <div className="card-body">
                <div className="meta-row">
                  <div>
                    <div className="restaurant">{item.restaurant}</div>
                    <div className="details">
                      {item.price} • {item.sectionTitle} • {item.etaText}
                    </div>
                  </div>
                  <a className="order-button" href={item.orderUrl} target="_blank" rel="noreferrer">
                    Order
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
