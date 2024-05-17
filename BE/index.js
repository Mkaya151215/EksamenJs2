const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
var cors = require('cors');
const { initilizeTeams } = require('./fmData.js')

const app = express();
const PORT = 3000;


let users = [];
let players = new Array();
let teams = new Array();
let userTeams = new Array();

const fmData = initilizeTeams(10);
players = fmData.players;
teams = fmData.teams;
app.use(cors());
app.use(bodyParser.json());

function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

function authorizeUser(req, res, next) {

    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('Unauthorized: No token provided');
    }
    const user = users.find(u => token.includes(u.token));
    if (!user) {
        return res.status(401).send('Unauthorized: Invalid token');
    }

    req.user = user;
    next();
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = authenticateUser(username, password);
    if (user) {
        const token = uuid.v4();
        user.token = token;
        res.json({ message: 'Login successful', token, username });
    } else {
        res.status(401).send('Invalid username or password');
    }
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        res.status(400).send('User already exists');
    } else {
        const token = uuid.v4();
        users.push({ username, password, token });
        res.json({ message: 'User registered successfully', token, username });
    }
});

app.get('/players', authorizeUser, (req, res) => {
    res.json(players.map((x) => ({
        name: x.name,
        currentTeam: x.currentTeam,
        teamId: x.currentTeamId,
        profileImage: x.profileImage,
        id: x.id
    })));
});

app.post('/players', authorizeUser, (req, res) => {
    const { id, name, team } = req.body;
    const newPlayer = { id, name, team };
    players.push(newPlayer);
    res.status(201).send('Player created successfully');
});

app.put('/players/:id', authorizeUser, (req, res) => {
    const playerId = req.params.id;
    const { name, transferFee } = req.body;
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex !== -1) {
        players[playerIndex].name = name;
        players[playerIndex].transferFee = transferFee;
        res.send('Player updated successfully');
    } else {
        res.status(404).send('Player not found');
    }
});

app.delete('/players/:id', authorizeUser, (req, res) => {
    const playerId = req.params.id;
    players = players.filter(p => p.id !== playerId);
    res.send('Player deleted successfully');
});


app.get('/players/:id', authorizeUser, (req, res) => {
    const playerId = req.params.id;
    const player = players.find(p => p.id === playerId);
    if (player) {
        res.json(player);
    } else {
        res.status(404).send('Player not found');
    }
});

app.get('/teams/:id', authorizeUser, (req, res) => {
    const teamId = req.params.id;
    const team = teams.find(p => p.id === teamId);
    if (team) {
        res.json(team);
    } else {
        res.status(404).send('Team not found');
    }
});

app.get('/teams', authorizeUser, (req, res) => {
    res.json(teams.map((x) => ({ name: x.teamName, id: x.id })));
});

app.get('/myteam', authorizeUser, (req, res) => {
    const userTeam = userTeams.find(team => team.username === req.user.username);
    if (userTeam) {
        res.json(userTeam.team);
    }
    else {
        res.json([]);
    }
});

app.post('/myteam', authorizeUser, (req, res) => {
    const userTeam = userTeams.find(team => team.username === req.user.username);

    if (userTeam) {
        userTeam.team = [...new Set(req.body)];
    }
    else {
        userTeams.push({ username: req.user.username, team: [...new Set(req.body)] });
    }
    res.status(201).send('Team created successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

