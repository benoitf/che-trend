import { inject, injectable, named } from 'inversify';

import { IssueDescription } from '../api/issue-description';
import { IssueDescriptionBuilder } from '../issue/issue-description-builder';
import { graphql } from '@octokit/graphql';

/**
 * Manage the import from github
 */
@injectable()
export class GithubImport {
  @inject('string')
  @named('GRAPHQL_AUTHORIZATION')
  private authorizationToken: string;

  @inject(IssueDescriptionBuilder)
  private issueInfoBuilder: IssueDescriptionBuilder;

  protected computeRepositories(): string {
    const repositories: string[] = [];
    repositories.push('repo:eclipse/che');
    repositories.push('repo:eclipse/che-workspace-loader');
    repositories.push('repo:eclipse/che-dashboard');
    repositories.push('repo:che-incubator/chectl');
    repositories.push('repo:eclipse/che-theia');
    repositories.push('repo:eclipse/che-plugin-registry');
    repositories.push('repo:eclipse/che-devfile-registry');
    repositories.push('repo:eclipse/che-docs');
    repositories.push('repo:eclipse/che-machine-exec');
    repositories.push('repo:eclipse/che-operator');
    repositories.push('repo:eclipse/che-plugin-broker');
    repositories.push('repo:eclipse/che-website');
    repositories.push('repo:eclipse/che-workspace-client');
    return repositories.join(' ');
  }

  public async import(startDate: Date): Promise<IssueDescription[]> {
    const issueData: unknown[] = await this.doImport(startDate);
    return Promise.all(
      issueData.map((issueData: unknown) => {
        return this.issueInfoBuilder.build(issueData);
      })
    );
  }

  protected async doImport(startDate: Date, cursor?: string, previousIssues?: unknown[]): Promise<unknown[]> {
    const date = startDate.toISOString().substring(0, 10);

    const query = `
    query recentIssues($q: String!, $cursorAfter: String) {
      search(query: $q, type: ISSUE, first: 100, after: $cursorAfter) {
        issueCount
        pageInfo {
          ... on PageInfo {
            endCursor
            hasNextPage
          }
        }
    
        nodes {
          ... on PullRequest {
            __typename
            createdAt
            url
            author {
              login
              url
            }
            repository {
              name
              owner {
                login
              }
            }
            authorAssociation
            url
            number
            title
            closedAt
            merged
            pullRequestState: state
            labels(first: 100) {
              nodes {
                ... on Label {
                  name
                }
              }
            }
          }
          ... on Issue {
            __typename
            author {
              login
              url
            }
            repository {
              name
              owner {
                login
              }
            }
            authorAssociation
            number
            title
            createdAt
            url
            closedAt
            state
            labels(first: 100) {
              nodes {
                ... on Label {
                  name
                }
              }
            }
          }
        }
      }
    }
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphQlResponse: any = await graphql(query, {
      q: `${this.computeRepositories()} updated:>=${date}`,
      cursorAfter: cursor,
      headers: {
        authorization: this.authorizationToken,
      },
    });

    let allGraphQlResponse;
    if (previousIssues) {
      allGraphQlResponse = previousIssues.concat(graphQlResponse.search.nodes);
    } else {
      allGraphQlResponse = graphQlResponse.search.nodes;
    }

    // need to loop again
    if (graphQlResponse.search.pageInfo.hasNextPage) {
      // needs to redo the search starting from the last search
      return await this.doImport(startDate, graphQlResponse.search.pageInfo.endCursor, allGraphQlResponse);
    }

    // from reverse order
    return allGraphQlResponse.reverse();
  }
}
