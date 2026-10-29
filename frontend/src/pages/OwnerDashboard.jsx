import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

function OwnerDashboard() {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/owner/dashboard", { token })
      .then((data) => setStores(data.stores || []))
      .catch((err) => setError(err.message));
  }, [token]);

  if (error) return <p className="error-message">{error}</p>;

  return (
    <section>
      <h1>Store Owner Dashboard</h1>
      <p>Ratings and feedback for your stores.</p>

      {stores.length === 0 && !error && (
        <p>No stores have been assigned to you yet.</p>
      )}

      <div className="store-grid">
        {stores.map(({ store, averageRating, ratingCount, ratings }) => (
          <article className="store-card" key={store.id}>
            <h2>{store.name}</h2>
            <p>{store.address}</p>
            <p>Average rating: {averageRating} / 5</p>
            <p>Total ratings: {ratingCount}</p>

            <h3>Customer ratings</h3>

{ratings.length === 0 ? (
  <p>No ratings have been submitted for this store yet.</p>
) : (
  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Email</th>
          <th>Rating</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {ratings.map((rating, index) => (
          <tr
            key={`${rating.submittedAt}-${rating.user?.email || index}`}
          >
            <td>{rating.user?.name || "Unknown user"}</td>
            <td>{rating.user?.email || "Unavailable"}</td>
            <td>{rating.score} / 5</td>
            <td>
              {rating.submittedAt
                ? new Date(rating.submittedAt).toLocaleDateString()
                : "Unavailable"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
          </article>
        ))}
      </div>
    </section>
  );
}

export default OwnerDashboard;