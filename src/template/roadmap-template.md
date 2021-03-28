---
title: Roadmap
---

# Eclipse Che Roadmap 🔥
{{#with roadmap}}

## Short Term ⏱️

Epics with an estimated due date of 3 months or less

{{#each shortTermRoadmapIssues}}
 - [{{ this.title}}]({{this.url}})
{{/each}}

## Mid Term ⏰

Epics with an estimated due date between 3 and 12 months

{{#each midTermRoadmapIssues}}
 - [{{ this.title}}]({{this.url}})
{{/each}}

## Long Term ⏳

Epics with an estimated due date of 12 months or more

{{#each longTermRoadmapIssues}}
 - [{{ this.title}}]({{this.url}})
{{/each}}

{{/with}}
