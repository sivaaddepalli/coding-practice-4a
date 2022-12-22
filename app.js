const express = require("express");
const app = express();
app.use(express.json());

const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbpath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
      console.log(db);
    });
  } catch (e) {
    console.log(`dbError:${e.message}`);
    process.exit(1);
  }
};
initializeDbServer();

// Get Players API

app.get("/players/", async (request, response) => {
  const playersQuery = `
    SELECT * 
    FROM 
    cricket_team 
    ORDER BY 
        player_id;
    `;
  const playersArray = await db.all(playersQuery);
  response.send(playersArray);
});

// post players API

app.post("/players/", async (request, response) => {
  const playersDetails = request.body;
  const { playerName, jerseyNumber, role } = playersDetails;

  const addPlayerQuery = `
    INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES(${playerName},${jerseyNumber},${role});

    `;
  const dbresponse = await db.run(addPlayerQuery);
  const playerId = dbresponse.lastID;
  reponse.send(playerId);
});

app.get("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team 
    WHERE player_id = ${playerId};`;
  const getPlayer = db.run(getPlayerQuery);
  request.send(getPlayer);
});

// put API

app.put("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const playersDetails = request.body;
  const { playerName, jerseyNumber, role } = playersDetails;
  const updatePlayerQuery = `UPDATE cricket_team 
    SET player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role}
    WHERE player_id = ${playerId}
    `;

  const dataUpdate = db.run(updatePlayerQuery);
  response.send("Updated Successfully");
});

// delete API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deleteQuery = `DELETE FROM cricket_team WHERE player_id=${playerId}`;
  await db.run(deleteQuery);
  response.send("Deleted row successfully");
});
