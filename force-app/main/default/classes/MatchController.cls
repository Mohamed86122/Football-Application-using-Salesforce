public with sharing class MatchController {
    @AuraEnabled(cacheable=true)
    public static List<Team__c> getLiveMatches() {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.football-data.org/v4/matches');
        req.setHeader('X-Auth-Token', '51db23a79e5eb319802b272991a7da6c');
        req.setMethod('GET');

        HttpResponse res = http.send(req);

        List<Team__c> matches = new List<Team__c>();
        if (res.getStatusCode() == 200) {
            Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            // Logique de parsing + map vers objets Salesforce
        }

        return matches;
    }
}
