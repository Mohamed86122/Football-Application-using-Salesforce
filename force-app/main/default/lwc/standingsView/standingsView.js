import { LightningElement, api, wire } from 'lwc';
import getStandings from '@salesforce/apex/StandingsController.getStandings';

export default class StandingsView extends LightningElement {
    @api leagueId = '39'; // Default League
    @api season = '2023';
    filteredStandings = [];
    error;

    @wire(getStandings, { leagueId: '$leagueId', season: '$season' })
    wiredData({ error, data }) {
        if (data) {
            this.filteredStandings = data;
        } else if (error) {
            this.error = error;
        }
    }

    connectedCallback() {
        // Listen to the 'matchselect' event from the parent component
        this.addEventListener('matchselect', this.handleMatchSelect);
    }

    handleMatchSelect(event) {
        const { homeTeam, awayTeam } = event.detail;

        // Filter the standings data based on the selected teams
        this.filteredStandings = this.filteredStandings.filter(team =>
            team.teamName === homeTeam || team.teamName === awayTeam
        );
    }

    get columns() {
        return [
            { label: 'Rang', fieldName: 'rank', type: 'number' },
            { label: 'Équipe', fieldName: 'teamName', type: 'text' },
            { label: 'Pts', fieldName: 'points', type: 'number' },
            { label: 'Matchs', fieldName: 'played', type: 'number' },
            { label: 'Victoires', fieldName: 'win', type: 'number' },
            { label: 'Nuls', fieldName: 'draw', type: 'number' },
            { label: 'Défaites', fieldName: 'lose', type: 'number' }
        ];
    }
}
