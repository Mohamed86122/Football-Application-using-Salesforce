public with sharing class StandingsController {

    public class Standing {
        @AuraEnabled public Integer rank;
        @AuraEnabled public String teamName;
        @AuraEnabled public String teamLogo;
        @AuraEnabled public Integer played;
        @AuraEnabled public Integer win;
        @AuraEnabled public Integer draw;
        @AuraEnabled public Integer lose;
        @AuraEnabled public Integer points;
    }

    @AuraEnabled(cacheable=true)
    public static List<Standing> getStandings(String leagueId, String season) {
        List<Standing> standings = new List<Standing>();
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://v3.football.api-sports.io/standings?league=' + leagueId + '&season=' + season);
        req.setHeader('x-apisports-key', '51db23a79e5eb319802b272991a7da6c');
        req.setMethod('GET');
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            Map<String, Object> fullResponse = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            List<Object> response = (List<Object>) fullResponse.get('response');

            if (!response.isEmpty()) {
                Map<String, Object> standingsWrapper = (Map<String, Object>) response[0];
                List<Object> leagueStandings = (List<Object>) ((Map<String, Object>) standingsWrapper.get('league')).get('standings');
                List<Object> table = (List<Object>) leagueStandings[0];

                for (Object item : table) {
                    Map<String, Object> row = (Map<String, Object>) item;
                    Map<String, Object> team = (Map<String, Object>) row.get('team');
                    Map<String, Object> all = (Map<String, Object>) row.get('all');

                    Standing s = new Standing();
                    s.rank = ((Integer) row.get('rank'));
                    s.teamName = (String) team.get('name');
                    s.teamLogo = (String) team.get('logo');
                    s.played = (Integer) all.get('played');
                    s.win = (Integer) all.get('win');
                    s.draw = (Integer) all.get('draw');
                    s.lose = (Integer) all.get('lose');
                    s.points = (Integer) row.get('points');

                    standings.add(s);
                }
            }
        }
        return standings;
    }
}
