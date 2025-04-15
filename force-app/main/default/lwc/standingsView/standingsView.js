import { LightningElement, api, wire } from 'lwc';
import getStandings from '@salesforce/apex/StandingsController.getStandings';

export default class StandingsView extends LightningElement {
    @api leagueId = '39'; // Par défaut : Premier League
    @api season = '2023'; // Par défaut : 2023
    selectedCountry = ''; // Pays sélectionné
    selectedLeague = ''; // Ligue sélectionnée
    selectedSeason = ''; // Année sélectionnée

    countryOptions = [];
    leagueOptions = [];
    seasonOptions = [{ label: '2023', value: '2023' }, { label: '2024', value: '2024' }];
    
    allStandings = [];
    filteredStandings = [];
    teamLogos = {};  // Contiendra les logos générés pour chaque équipe
    error;

    // Récupérer les ligues disponibles et les pays
    @wire(getStandings, { leagueId: '$leagueId', season: '$season' })
    wiredData({ error, data }) {
        if (data) {
            this.allStandings = data;
            this.filteredStandings = this.allStandings;
            this.generateLogos();  // Génére les logos après avoir récupéré les équipes
        } else if (error) {
            this.error = error;
        }
    }

    connectedCallback() {
        // Appel pour récupérer les pays et ligues disponibles (ex: API ou données statiques)
        this.countryOptions = [
            { label: 'France', value: 'FR' },
            { label: 'Angleterre', value: 'ENG' },
            { label: 'Espagne', value: 'ESP' }
        ];
        this.leagueOptions = [
            { label: 'Ligue 1', value: 'L1' },
            { label: 'Premier League', value: 'PL' },
            { label: 'La Liga', value: 'LL' }
        ];
    }

    handleCountryChange(event) {
        this.selectedCountry = event.detail.value;
        this.updateFilteredStandings();
    }

    handleLeagueChange(event) {
        this.selectedLeague = event.detail.value;
        this.updateFilteredStandings();
    }

    handleSeasonChange(event) {
        this.selectedSeason = event.detail.value;
        this.updateFilteredStandings();
    }

    // Met à jour le classement affiché en fonction des filtres sélectionnés
    updateFilteredStandings() {
        this.filteredStandings = this.allStandings.filter(team => {
            return (
                (!this.selectedCountry || team.country === this.selectedCountry) &&
                (!this.selectedLeague || team.league === this.selectedLeague) &&
                (!this.selectedSeason || team.season === this.selectedSeason)
            );
        });
    }

    // Fonction pour générer les logos avec ui-avatars
    generateLogos() {
        this.teamLogos = {};  // Réinitialise le cache des logos
        this.allStandings.forEach(team => {
            const teamLogo = `https://ui-avatars.com/api/?name=${team.teamName.replace(/\s/g, '+')}&background=random`;
            this.teamLogos[team.teamName] = teamLogo;
        });
    }

    get columns() {
        return [
            { label: 'Rang', fieldName: 'rank', type: 'number' },
            { label: 'Équipe', fieldName: 'teamName', type: 'text' },
            { label: 'Logo', fieldName: 'teamLogo', type: 'image' },
            { label: 'Pts', fieldName: 'points', type: 'number' },
            { label: 'Matchs', fieldName: 'played', type: 'number' },
            { label: 'Victoires', fieldName: 'win', type: 'number' },
            { label: 'Nuls', fieldName: 'draw', type: 'number' },
            { label: 'Défaites', fieldName: 'lose', type: 'number' }
        ];
    }
}
