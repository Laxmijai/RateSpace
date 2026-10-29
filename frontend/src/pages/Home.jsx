import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { token, user } = useAuth();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [myRatings, setMyRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadStores() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          search,
          sortBy,
          order,
        });

        const data = await apiRequest(`/stores?${params}`, { token });

        if (!cancelled) {
          setStores(data.stores || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStores();

    return () => {
      cancelled = true;
    };
  }, [token, search, sortBy, order]);

  async function submitRating(storeId) {
    const score = Number(myRatings[storeId]);

    if (!Number.isInteger(score) || score < 1 || score > 5) {
      setError("Choose a rating from 1 to 5.");
      return;
    }

    try {
      setError("");
      setNotice("");

      await apiRequest(`/ratings/${storeId}`, {
        method: "POST",
        body: { score },
        token,
      });

      // Refresh the store list to show updated averages.
      const params = new URLSearchParams({ search, sortBy, order });
      const data = await apiRequest(`/stores?${params}`, { token });

      setStores(data.stores || []);
      setNotice("Your rating was submitted successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!token) {
    return (
      <section>
        <h1>Discover stores with RateSpace</h1>
        <p>Log in to explore stores and submit ratings.</p>
        <Link to="/login">Log in</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Explore stores</h1>
      <p>Welcome, {user?.name || "user"}.</p>

      <div className="store-filters">
        <input
          aria-label="Search stores"
          placeholder="Search by store name or address"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          aria-label="Sort stores by"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="name">Store name</option>
          <option value="averageRating">Average rating</option>
        </select>

        <select
          aria-label="Sort order"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}
      {notice && <p>{notice}</p>}
      {loading && <p>Loading stores...</p>}

      {!loading && stores.length === 0 && (
        <p>No stores found.</p>
      )}

      <div className="store-grid">
        {stores.map((store) => (
          <article className="store-card" key={store._id}>
            <h2>{store.name}</h2>
            <p>{store.address}</p>

            <p>
              Average rating:{" "}
              {Number(store.averageRating || 0).toFixed(1)} / 5
            </p>
            <p>{store.ratingCount || 0} ratings</p>

            {user?.role === "NORMAL_USER" && (
              <div className="rating-controls">
                <label>
                  Your rating
                  <select
                    value={myRatings[store._id] || ""}
                    onChange={(event) =>
                      setMyRatings({
                        ...myRatings,
                        [store._id]: event.target.value,
                      })
                    }
                  >
                    <option value="">Choose a rating</option>
                    {[1, 2, 3, 4, 5].map((score) => (
                      <option key={score} value={score}>
                        {score} / 5
                      </option>
                    ))}
                  </select>
                </label>

                <button onClick={() => submitRating(store._id)}>
                  Submit rating
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Home;