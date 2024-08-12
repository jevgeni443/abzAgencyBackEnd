import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");

  useEffect(() => {
    fetch(`https://server-abz-803d12a8a680.herokuapp.com/users?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setUsers(data.slice((page - 1) * 6, page * 6));
          setTotalPages(Math.ceil(data.length / 6));
        } else {
          setUsers([]);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [page]);

  useEffect(() => {
    fetch("https://server-abz-803d12a8a680.herokuapp.com/positions")
      .then((response) => response.json())
      .then((data) => setPositions(data))
      .catch((error) => console.error("Error fetching positions:", error));
  }, []);

  const addUser = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await fetch(
        "https://server-abz-803d12a8a680.herokuapp.com/users",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();

      if (response.ok) {
        setErrorMessage("");
        setPage(1);
      } else {
        setErrorMessage(
          result.errors
            ? result.errors.map((err) => err.msg).join(", ")
            : result.error
        );
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage("Ошибка добавления пользователя");
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul>
        {users.map((user) => (
          <div key={user.id} className="user-card">
            {user.imageUrl && (
              <img
                src={`https://server-abz-803d12a8a680.herokuapp.com/public/${user.imageUrl}`}
                alt=""
                width="70"
                height="70"
              />
            )}
            <div className="user-info">
              <p>
                {user.firstName} {user.lastName}
              </p>
              <p>
                {user.email} {user.phone} (ID: {user.positionId}, Position:{" "}
                {user.position})
              </p>
            </div>
          </div>
        ))}
      </ul>

      <div>
        <button onClick={handlePrevPage} disabled={page === 1}>
          &lt; Previous
        </button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Show More &gt;
        </button>
      </div>

      <h2>Add User</h2>
      <form onSubmit={addUser} encType="multipart/form-data">
        <input name="firstName" placeholder="First Name" required />
        <input name="lastName" placeholder="Last Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="phone" placeholder="Phone" />
        <select
          name="position"
          placeholder="Position"
          required
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          <option value="">Select position</option>
          {positions.map((pos) => (
            <option key={pos.positionId} value={pos.position}>
              {pos.position}
            </option>
          ))}
        </select>

        <input name="image" type="file" required />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default App;
