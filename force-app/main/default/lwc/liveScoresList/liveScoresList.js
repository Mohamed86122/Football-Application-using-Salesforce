import { LightningElement } from 'lwc';
import getLiveMatches from '@salesforce/apex/MatchController.getLiveMatches';
import { wire } from 'lwc';

function generateLogo(teamName) {
    return `https://ui-avatars.com/api/?name=${teamName.replace(/\s/g, '+')}&background=random`;
}
export default class LiveScoresList extends LightningElement {
    matches = [];
    error;

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

}