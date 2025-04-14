public with sharing class MatchController {
    
    public class Match {
        @AuraEnabled public String homeTeam;
        @AuraEnabled public String awayTeam;
        @AuraEnabled public String status;
        @AuraEnabled public String matchTime;
        @AuraEnabled public String score;
    }

    @AuraEnabled(cacheable=true)
    public static List<Match> getLiveMatches() {
        List<Match> matches = new List<Match>();

        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://v3.football.api-sports.io/fixtures?live=all');
        req.setMethod('GET');
        req.setHeader('x-apisports-key', '51db23a79e5eb319802b272991a7da6c'); // Remplace avec ton token valide

        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            Map<String, Object> fullResponse = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());

            if (fullResponse.containsKey('response')) {
                Object responseObj = fullResponse.get('response');
                
                if (responseObj instanceof List<Object>) {
                    List<Object> responseList = (List<Object>) responseObj;

                    for (Object item : responseList) {
                        if (item instanceof Map<String, Object>) {
                            Map<String, Object> matchData = (Map<String, Object>) item;

                            Match m = new Match();

                            // Equipes
                            if (matchData.containsKey('teams')) {
                                Map<String, Object> teams = (Map<String, Object>) matchData.get('teams');
                                if (teams != null) {
                                    Map<String, Object> home = (Map<String, Object>) teams.get('home');
                                    Map<String, Object> away = (Map<String, Object>) teams.get('away');
                                    m.homeTeam = home != null ? (String) home.get('name') : 'N/A';
                                    m.awayTeam = away != null ? (String) away.get('name') : 'N/A';
                                }
                            }

                            // Date & Statut
                            if (matchData.containsKey('fixture')) {
                                Map<String, Object> fixture = (Map<String, Object>) matchData.get('fixture');
                                m.matchTime = fixture != null ? (String) fixture.get('date') : 'N/A';

                                if (fixture != null && fixture.containsKey('status')) {
                                    Map<String, Object> status = (Map<String, Object>) fixture.get('status');
                                    m.status = status != null ? (String) status.get('short') : 'N/A';
                                }
                            }

                            // Score
                            if (matchData.containsKey('goals')) {
                                Map<String, Object> goals = (Map<String, Object>) matchData.get('goals');
                                if (goals != null) {
                                    Object homeGoals = goals.get('home');
                                    Object awayGoals = goals.get('away');
                                    m.score = String.valueOf(homeGoals) + ' - ' + String.valueOf(awayGoals);
                                } else {
                                    m.score = 'N/A';
                                }
                            }

                            matches.add(m);
                        }
                    }
                }
            }
        } else {
            System.debug('API Error: ' + res.getBody());
        }

        return matches;
    }
}
