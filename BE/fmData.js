const { faker } = require('@faker-js/faker');
const uuid = require('uuid');
let players = new Array();
let teams = new Array();
const teamNames = [
    'Real Madrid (Spain)',
    'Barcelona (Spain)',
    'Bayern Munich (Germany)',
    'Manchester United (England)',
    'Chelsea (England)',
    'Manchester City (England)',
    'Liverpool (England)',
    'Juventus (Italy)',
    'Paris Saint-Germain (France)',
    'Atlético Madrid (Spain)',
    'Inter Milan (Italy)',
    'Tottenham Hotspur (England)',
    'Arsenal (England)',
    'Borussia Dortmund (Germany)',
    'AS Roma (Italy)',
    'Leicester City (England)',
    'Sevilla (Spain)',
    'Everton (England)',
    'Ajax (Netherlands)',
    'Napoli (Italy)',
    'Bayer Leverkusen (Germany)',
    'West Ham United (England)',
    'Villarreal (Spain)',
    'Lazio (Italy)',
    'RB Leipzig (Germany)',
    'Atalanta (Italy)',
    'Real Sociedad (Spain)',
    'Olympique Lyonnais (France)',
    'Benfica (Portugal)',
    'Porto (Portugal)',
    'Zenit Saint Petersburg (Russia)',
    'Krasnodar (Russia)',
    'PSV Eindhoven (Netherlands)',
    'Fenerbahçe (Turkey)',
    'Galatasaray (Turkey)',
    'Beşiktaş (Turkey)',
    'Olympiakos (Greece)',
    'Celtic (Scotland)',
    'Rangers (Scotland)',
    'Club Brugge (Belgium)',
    'Sporting CP (Portugal)',
    'Dynamo Kyiv (Ukraine)',
    'Shakhtar Donetsk (Ukraine)',
    'Basel (Switzerland)',
    'Slavia Prague (Czech Republic)',
    'Rapid Wien (Austria)',
    'Malmö FF (Sweden)',
    'FC Copenhagen (Denmark)',
    'KRC Genk (Belgium)',
    'Lille OSC (France)',
  ];

function generatePlayer(teamName, teamId) {
  return {
    name: faker.helpers.fake(
        '{{person.firstName}} {{person.lastName}}'),
    age: faker.number.int({ min: 18, max: 40 }),
    nation: faker.location.country(),
    currentTeam: teamName,
    currentTeamId: teamId,
    transferFee: `${faker.number.int({ min: 1, max: 100 })} million`,
    position: faker.helpers.arrayElement([
      'Goalkeeper',
      'Defender',
      'Midfielder',
      'Forward',
    ]),
    goalsScored: faker.number.int({ min: 0, max: 30 }),
    profileImage: faker.image.urlLoremFlickr({ category: ('FootballPlayer') }), 
    id: uuid.v4()
  };
}


function generateTeam() {
  const teamName =  faker.helpers.arrayElement(teamNames);
  const teamId =  uuid.v4();
  // Generate Team Players
  players = players.concat(Array.from(
    { length: faker.number.int({ min: 15, max: 30 }) },
    ()=>{ return generatePlayer(teamName, teamId)} 
   ));

  return {
    teamName: teamName,
    league: faker.helpers.arrayElement([
      'Premier League',
      'La Liga',
      'Bundesliga',
      'Serie A',
      'Ligue 1',
    ]),
    championships: faker.number.int({ min: 0, max: 30 }),
    president: faker.helpers.fake(
                 '{{person.firstName}} {{person.lastName}}'),
    marketValue: `${faker.number.int({ min: 500, max: 2000 })} million $`,
    logo: faker.image.urlLoremFlickr({ category: ('TeamLogo') }), 
    id: teamId
  };
}


function generateTeams(numTeams) {
  return Array.from({ length: numTeams }, generateTeam);
}

function getTeamJSON() {
  return JSON.stringify({ players:players, teams: teams}, null, 2);
}
function initilizeTeams(numTeams) {
    teams =  generateTeams(numTeams);
    return {teams, players}
}

module.exports ={ 
    getTeamJSON, initilizeTeams
}