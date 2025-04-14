import { LightningElement } from 'lwc';

export default class LiveScoresHome extends LightningElement {
    filteredStandings = [];

    handleMatchSelect(event) {
        const { homeTeam, awayTeam } = event.detail;
        const standings = this.template.querySelector('c-standings-view');

        if (standings && standings.showTeams) {
            standings.showTeams([homeTeam, awayTeam]);
        }
    }
}
