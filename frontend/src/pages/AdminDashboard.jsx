import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { token } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "STORE_OWNER",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    address: "",
    ownerId: "",
  });

  async function loadDashboard() {
    const [statsData, usersData, ownersData] = await Promise.all([
      apiRequest("/dashboard/admin", { token }),
      apiRequest("/admin/users", { token }),
      apiRequest("/admin/users?role=STORE_OWNER", { token }),
    ]);

    setStats(statsData);
    setUsers(usersData.users || []);
    setOwners(ownersData.users || []);
  }

  useEffect(() => {
    loadDashboard().catch((err) => setError(err.message));
  }, [token]);

  function handleUserChange(event) {
    setUserForm({
      ...userForm,
      [event.target.name]: event.target.value,
    });
  }

  async function handleCreateUser(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await apiRequest("/admin/users", {
        method: "POST",
        body: userForm,
        token,
      });

      setMessage(data.message);
      setUserForm({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "STORE_OWNER",
      });

      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateStore(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await apiRequest("/stores", {
        method: "POST",
        body: storeForm,
        token,
      });

      setMessage(data.message);
      setStoreForm({
        name: "",
        address: "",
        ownerId: "",
      });

      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.address.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );
  });

  return (
    <section>
      <h1>Administrator Dashboard</h1>

      {error && <p className="error-message">{error}</p>}
      {message && <p>{message}</p>}

      {stats && (
        <div className="stats-grid">
          <article className="store-card">
            <h2>Total users</h2>
            <p>{stats.totalUsers}</p>
          </article>

          <article className="store-card">
            <h2>Total stores</h2>
            <p>{stats.totalStores}</p>
          </article>

          <article className="store-card">
            <h2>Total ratings</h2>
            <p>{stats.totalRatings}</p>
          </article>
        </div>
      )}

      <h2>Create a user</h2>

      <form className="form admin-form" onSubmit={handleCreateUser}>
        <input
          name="name"
          placeholder="Full name (20–60 characters)"
          value={userForm.name}
          onChange={handleUserChange}
          minLength={20}
          maxLength={60}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={userForm.email}
          onChange={handleUserChange}
          required
        />

        <input
          name="address"
          placeholder="Address"
          value={userForm.address}
          onChange={handleUserChange}
          maxLength={400}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={userForm.password}
          onChange={handleUserChange}
          minLength={8}
          maxLength={16}
          required
        />

        <select
          name="role"
          value={userForm.role}
          onChange={handleUserChange}
        >
          <option value="STORE_OWNER">Store owner</option>
          <option value="NORMAL_USER">Normal user</option>
        </select>

        <button type="submit">Create user</button>
      </form>

      <h2>Create a store</h2>

      <form className="form admin-form" onSubmit={handleCreateStore}>
        <input
          placeholder="Store name"
          value={storeForm.name}
          onChange={(event) =>
            setStoreForm({ ...storeForm, name: event.target.value })
          }
          required
        />

        <input
          placeholder="Store address"
          value={storeForm.address}
          onChange={(event) =>
            setStoreForm({ ...storeForm, address: event.target.value })
          }
          maxLength={400}
          required
        />

        <select
          value={storeForm.ownerId}
          onChange={(event) =>
            setStoreForm({ ...storeForm, ownerId: event.target.value })
          }
          required
        >
          <option value="">Choose a store owner</option>

          {owners.map((owner) => (
            <option key={owner._id} value={owner._id}>
              {owner.name} ({owner.email})
            </option>
          ))}
        </select>

        <button type="submit">Create store</button>
      </form>

      <h2>Manage users</h2>

      <input
        placeholder="Search by name, email, address, or role"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="store-grid">
        {filteredUsers.map((user) => (
          <article className="store-card" key={user._id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.address}</p>
            <p>Role: {user.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboard;