import KudosFeed from './KudosFeed';
import ModerationPanel from './ModerationPanel';

function App() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
      <KudosFeed />
      <hr style={{ margin: "2rem 0", border: "none", borderTop: "0.5px solid #e0e0e0" }} />
      <ModerationPanel />
    </div>
  );
}

export default App;