import './App.css'

const items = [
  {
    id: 1,
    restaurant: 'Seoul Bowl',
    cuisine: 'Korean',
    title: 'Spicy bulgogi rice bowl',
    price: '$14.95',
    eta: '32 min',
    delivery: 'Uber Eats',
    blurb: 'Sweet heat, kimchi crunch, and a jammy egg. Extremely scroll-stopping.',
    tags: ['Hot now', 'Protein-heavy', 'Under $15'],
    gradient: 'linear-gradient(160deg, #ff9966 0%, #ff5e62 35%, #2b1055 100%)',
  },
  {
    id: 2,
    restaurant: 'Slice Theory',
    cuisine: 'Pizza',
    title: 'Vodka pepperoni square',
    price: '$6.50 / slice',
    eta: '24 min',
    delivery: 'DoorDash',
    blurb: 'Crispy edges, absurd cheese pull, and exactly the wrong amount of self-control.',
    tags: ['Trending', 'Late night', 'Best seller'],
    gradient: 'linear-gradient(160deg, #ffb347 0%, #ffcc33 30%, #8e44ad 100%)',
  },
  {
    id: 3,
    restaurant: 'Green Fork',
    cuisine: 'Healthy',
    title: 'Salmon crunch salad',
    price: '$17.25',
    eta: '28 min',
    delivery: 'Direct order',
    blurb: 'The algorithmic answer to “I want something healthy but not sad.”',
    tags: ['High protein', 'Fresh', 'Popular lunch'],
    gradient: 'linear-gradient(160deg, #56ab2f 0%, #a8e063 35%, #134e5e 100%)',
  },
  {
    id: 4,
    restaurant: 'Midnight Maki',
    cuisine: 'Sushi',
    title: 'Crispy spicy tuna roll set',
    price: '$19.80',
    eta: '39 min',
    delivery: 'Uber Eats',
    blurb: 'A dangerous amount of spicy mayo confidence in one neat little box.',
    tags: ['Open late', 'Fan favorite', 'Shareable'],
    gradient: 'linear-gradient(160deg, #36d1dc 0%, #5b86e5 35%, #2c3e50 100%)',
  },
  {
    id: 5,
    restaurant: 'Bun Patrol',
    cuisine: 'Burgers',
    title: 'Double smash truffle burger',
    price: '$16.40',
    eta: '27 min',
    delivery: 'DoorDash',
    blurb: 'Crisped edges, glossy bun, and enough sauce to ruin your focus for the evening.',
    tags: ['Craveable', 'Fast delivery', 'Comfort food'],
    gradient: 'linear-gradient(160deg, #f7971e 0%, #ffd200 30%, #7f00ff 100%)',
  },
]

function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Proof of concept</p>
          <h1>Scroll what you can eat in under 60 minutes.</h1>
        </div>
        <button className="ghost-button">Use my location</button>
      </header>

      <section className="phone-frame" aria-label="Vertical food discovery feed">
        <div className="feed-header">
          <div>
            <p className="feed-title">Tonight</p>
            <span className="feed-subtitle">Cleveland • delivery under 60 min</span>
          </div>
          <div className="pill">5 live picks</div>
        </div>

        <div className="feed-scroll">
          {items.map((item) => (
            <article className="food-card" key={item.id}>
              <div className="media" style={{ background: item.gradient }}>
                <div className="media-overlay" />
                <div className="media-copy">
                  <span className="delivery-pill">{item.delivery}</span>
                  <div className="dish-type">{item.cuisine}</div>
                  <h2>{item.title}</h2>
                  <p>{item.blurb}</p>
                </div>
              </div>

              <div className="card-body">
                <div className="meta-row">
                  <div>
                    <div className="restaurant">{item.restaurant}</div>
                    <div className="details">{item.price} • ETA {item.eta}</div>
                  </div>
                  <button className="order-button">View</button>
                </div>

                <div className="tag-row">
                  {item.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
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
