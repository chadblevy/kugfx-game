body {
  font-family: Arial, sans-serif;
  margin: 0;
  background: #222;
  color: #fff;
}

#game {
  display: flex;
  height: 100vh;
}

/* Sidebar styling */
#sidebar {
  width: 250px;
  background: #333;
  padding: 20px;
  border-right: 2px solid #444;
}

#sidebar h2 {
  margin-top: 0;
}

#inventory-list {
  list-style: none;
  padding: 0;
}

/* Map area styling */
#map-area {
  flex: 1;
  position: relative;
  background: #111;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#map-area img {
  max-width: 90%;
  border: 2px solid #fff;
  border-radius: 8px;
}

#code-area {
  margin-top: 20px;
}

#code-input {
  padding: 8px;
  border: none;
  border-radius: 4px;
}

#submit-code {
  padding: 8px 12px;
  margin-left: 5px;
  background: #28a745;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

#submit-code:hover {
  background: #218838;
}
