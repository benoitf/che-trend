---
title: Week {{ weekNumber }}
---

# Eclipse Che Weekly Report

# WEEK #{{ weekNumber }}

{{#with statistics}}

#### Number of new issues this week ({{ percentNewIssuesFromPreviousWeek }})

{{ totalNewIssues }} total of which {{ totalNewIssuesBugs }} bugs, {{ totalNewIssuesEnhancements }} enhancements, {{ totalNewIssuesEpics }} epics, {{ totalNewIssuesTasks }} tasks, {{ totalNewIssuesPlanning }} plannings and {{ totalNewIssuesQuestions }} questions


#### Number of issues closed this week ({{ percentClosedIssuesFromPreviousWeek }})

{{ totalClosedIssues }} total of which {{ totalClosedIssuesBugs }} bugs, {{ totalClosedIssuesEnhancements }} enhancements, {{ totalClosedIssuesEpics }} epics, {{ totalClosedIssuesTasks }} tasks, {{ totalClosedIssuesPlanning }} plannings and {{ totalClosedIssuesQuestions }} questions

{{#if totalClosedIssuesAuto}}
{{ totalClosedIssuesAuto }} auto-closed issues.
{{/if}}

#### Number of new PRs this week ({{ percentNewPrsFromPreviousWeek }})

{{ totalNewPrs }} total of which {{ totalNewPrsExternal }} external


#### Number of merged PRs this week ({{ percentMergedPrsFromPreviousWeek }})

{{ totalPrsMerged }} total of which {{ totalNewPrsExternal }} external


{{#if sortedAreas}}
#### Issues by areas (opened/closed):
<ul style='font-family: monospace'>
{{#each sortedAreas}}
  <li>{{this.formattedName}}{{this.opened}}/{{this.closed}}</li>
{{/each}}
</ul>
{{/if}}

{{#if newIssuesExternalContributions}}
#### Community Contributions - new issues opened by non-Red Hat Che team ({{ percentNewIssuesFromPreviousWeekExternal }})

{{#each newIssuesExternalContributions}}
 - [[{{this.authorLogin}}]({{this.authorUrl}})] [{{ this.title}}]({{this.url}})
{{/each}}
{{/if}}

{{#if newPrsExternalContributions}}
#### Community Contributions - new PRs opened by non-Red Hat Che team ({{ percentNewPrsFromPreviousWeekExternal }})

{{#each newPrsExternalContributions}}
- [[{{this.authorLogin}}]({{this.authorUrl}})] [{{this.repoOwner}}/{{this.repoName}}]: [{{ this.title}}]({{this.url}})
{{/each}}
{{/if}}

{{#if mergedPrsExternalContributions}}
#### Community Contributions - merged PRs opened by non-Red Hat Che team ({{ percentMergedPrsFromPreviousWeekExternal }})

{{#each mergedPrsExternalContributions }}
- [[{{this.authorLogin}}]({{this.authorUrl}})] [{{this.repoOwner}}/{{this.repoName}}]: [{{ this.title}}]({{this.url}})
{{/each}}
{{/if}}

{{#if newIssuesNoteworthy}}
#### Noteworthy new issues

{{#each newIssuesNoteworthy}}
- [{{ this.title}}]({{this.url}})
{{/each}}
{{/if}}

{{#if mergedPrsNoteworthy}}
#### Noteworthy merged PRs

{{#each mergedPrsNoteworthy}}
- [{{this.repoOwner}}/{{this.repoName}}]: [{{ this.title}}]({{this.url}})
{{/each}}
{{/if}}

{{/with}}
