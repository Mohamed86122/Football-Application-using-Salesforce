import { LightningElement } from 'lwc';
import getLiveMatches from '@salesforce/apex/MatchController.getLiveMatches';
import { wire } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import TAILWIND_CSS from '@salesforce/resourceUrl/tailwindcss'; // Nom de ta ressource statique

function generateLogo(teamName) {
    return `https://ui-avatars.com/api/?name=${teamName.replace(/\s/g, '+')}&background=random`;
}
export default class LiveScoresList extends LightningElement {
    matches = [];
    error;
 // Lorsque le bouton est cliqué, on envoie les équipes sélectionnées à StandingsView
    handleButtonClick(event) {
        const homeTeam = event.currentTarget.dataset.home;
        const awayTeam = event.currentTarget.dataset.away;

        console.log(`Voir le classement pour : ${homeTeam} vs ${awayTeam}`);

        // Envoie un événement avec les équipes sélectionnées
        const matchEvent = new CustomEvent('matchselect', {
            detail: { homeTeam, awayTeam }
        });

    // Déclenche l'événement
    this.dispatchEvent(matchEvent);
}
    @wire(getLiveMatches)
    wiredMatches({ error, data }) {
        if (data) {
            console.log('✔ MATCHES FROM APEX:', data);
            this.matches = data.map(match => ({
                ...match,
                homeLogo: generateLogo(match.homeTeam),
                awayLogo: generateLogo(match.awayTeam)
            }));
        } else if (error) {
            console.error('❌ API ERROR:', error);
            this.error = error;
        }

    }
    handleMatchClick(event) {
        const homeTeam = event.currentTarget.dataset.home;
        const awayTeam = event.currentTarget.dataset.away;
        const matchId = event.currentTarget.dataset.id;
        const matchScore = event.currentTarget.dataset.score;
    
        console.log('Match sélectionné :', matchId, homeTeam, awayTeam, matchScore);
    
        const matchEvent = new CustomEvent('matchselect', {
            detail: { homeTeam, awayTeam, matchId }
        });
    
        this.dispatchEvent(matchEvent);
    }
    
    
    
    connectedCallback() {
        loadStyle(this, TAILWIND_CSS)
            .then(() => {
                console.log('Tailwind CSS loaded');
            })
            .catch(error => {
                console.error('Error loading Tailwind CSS:', error);
            });
    }

}