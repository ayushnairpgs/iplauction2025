// Global Constants
const TOTAL_BID_AMOUNT_PER_TEAM = 32;

const Table = ({ teamIndex, team, saveTeamsDataToLocalStorage }) => {
  const totalBids = team.players.reduce(
    (totalBid, player) => Number(totalBid) + (Number(player.bid) || 0),
    0
  );
  return (
    <div
      className="table"
      style={{
        backgroundColor: team.color,
      }}
    >
      <div
        className="logoContainer"
        style={{
          backgroundColor: team.color,
        }}
      >
        <img
          src={team.logo}
          alt={team.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            background: "transparent",
          }}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Player</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {team.players.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>
                <input
                  className="playerName"
                  type="text"
                  value={player.name}
                  onChange={(e) =>
                    saveTeamsDataToLocalStorage(e, teamIndex, index, "name")
                  }
                />
              </td>
              <td>
                <input
                  className="playerBid"
                  type="number"
                  value={player.bid === 0 ? "" : player.bid}
                  onChange={(e) =>
                    saveTeamsDataToLocalStorage(e, teamIndex, index, "bid")
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>Purse Spent</td>
            <td>{totalBids}</td>
          </tr>
          <tr>
            <td></td>
            <td>Remaining Purse</td>
            <td>{TOTAL_BID_AMOUNT_PER_TEAM - totalBids}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
function Slideshow({ images, currentIndex, setCurrentIndex }) {
  const [status, setStatus] = React.useState({});

  // Load saved statuses from localStorage
  React.useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("imageStatus")) || {};
    setStatus(savedStatus);
  }, []);

  // Save updated status to localStorage
  function updateStatus(newStatus) {
    const updatedStatus = { ...status, [images[currentIndex]]: newStatus };
    setStatus(updatedStatus);
    localStorage.setItem("imageStatus", JSON.stringify(updatedStatus));

    // Trigger confetti if marked as "Sold"
    if (newStatus === "Sold") {
      triggerConfetti();
    }
  }

  // Function to create confetti effect
  function triggerConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti-container");
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
      confetti.style.backgroundColor = [
        "red",
        "blue",
        "yellow",
        "green",
        "purple",
      ][Math.floor(Math.random() * 5)];
      confettiContainer.appendChild(confetti);
    }

    // Remove confetti after 1 second
    setTimeout(() => {
      confettiContainer.remove();
    }, 1000);
  }

  function prevSlide() {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function nextSlide() {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="slideShowAndControls" style={{ textAlign: "center", marginTop: "20px" }}>
      <div
        className="slideShow"
      >
        <img
          className="slides"
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
        />
        {status[images[currentIndex]] && (
          <p className="playerStatus"
            style={{
              background:
                status[images[currentIndex]] === "Sold" ? "green" : "red",
            }}
          >
            {status[images[currentIndex]]}
          </p>
        )}
      </div>

      <div>
        <button onClick={prevSlide} className="navBtn">⬅ Prev</button>
        <button onClick={nextSlide} className="navBtn">
          Next ➡
        </button>
        <button
          onClick={() => updateStatus("Sold")} className="statusBtn" style={{backgroundColor: "green"}}
        >
          Sold
        </button>
        <button
          onClick={() => updateStatus("Unsold")} className="statusBtn" style={{backgroundColor: "red"}}
        >
          Unsold
        </button>
        <button
          onClick={() => updateStatus("")} className="statusBtn" style={{backgroundColor: "grey"}}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function App() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [teams, setTeams] = React.useState([]);
  const [page, setPage] = React.useState("teams");
  const images = [
    "./resources/VK18.png",
    "./resources/JB93.png",
    "./resources/RS45.png",
  ];

  React.useEffect(() => {
    const localTeams = localStorage.getItem("teams");
    if (localTeams) {
      try {
        setTeams(JSON.parse(localTeams));
      } catch (error) {
        console.error("Error parsing local storage data:", error);
      }
    } else {
      fetch("data/teams.json")
        .then((response) => response.json())
        .then((data) => setTeams(data))
        .catch((error) => console.error("Error loading JSON:", error));
    }
    const localPlayerIndex = localStorage.getItem("playerIndex");
    if (localPlayerIndex) {
      setCurrentIndex(parseInt(localPlayerIndex));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("playerIndex", JSON.stringify(currentIndex));
  }, [currentIndex]);

  const saveTeamsDataToLocalStorage = (e, teamIndex, playerIndex, field) => {
    let value = e.target.value;
    if (field === "bid") {
      value = Number(e.target.value);
    }
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].players[playerIndex][field] = value;
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  return (
    <div>
      {page === "players" && (
        <div className="teams-screen">
          <h1 onClick={() => setPage("teams")}>PLAYERS</h1>
          <Slideshow
            images={images}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          ></Slideshow>
        </div>
      )}
      {page === "teams" && (
        <div className="players-screen">
          <h1 onClick={() => setPage("players")}>AUCTION SUMMARY</h1>
          <div className="table-container">
            {teams.map((team, index) => (
              <Table
                key={team.location + team.name}
                teamIndex={index}
                team={team}
                saveTeamsDataToLocalStorage={saveTeamsDataToLocalStorage}
              ></Table>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
