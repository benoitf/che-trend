import * as moment from 'moment';

import { inject, injectable } from 'inversify';

import { ExternalContributor } from './external-contributor';
import { IssueDescription } from '../api/issue-description';
import { PullRequestDescription } from '../api/pull-request-description';

/**
 * Info is a high level of the underlying data associated to an issue.
 */
@injectable()
export class IssueDescriptionBuilder {
  @inject(ExternalContributor)
  private externalContributor: ExternalContributor;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async build(issueData: any): Promise<IssueDescription> {
    const labels: string[] = [];
    if (issueData.labels.nodes) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      issueData.labels.nodes.forEach((label: any) => {
        labels.push(label.name);
      });
    }

    const areaLabels = labels
      .filter((label) => label.startsWith('area/'))
      .map((label) => label.substring('area/'.length));
    const kindLabels = labels
      .filter((label) => label.startsWith('kind/'))
      .map((label) => label.substring('area/'.length));

    const isPullRequest = issueData.__typename === 'PullRequest';
    const isIssue = issueData.__typename === 'Issue';

    const isExternal = await this.externalContributor.isExternal(issueData.author.login);

    const isOpen =
      (isPullRequest && issueData.pullRequestState.toLowerCase() === 'open') ||
      (isIssue && issueData.state.toLowerCase() === 'open');

    const isClosed =
      (isPullRequest && issueData.pullRequestState.toLowerCase() === 'closed') ||
      (isIssue && issueData.state.toLowerCase() === 'closed');

    const createdShortDate = moment(issueData.createdAt).utc().format('M/D/YYYY');
    const createdShortDateIso = moment(issueData.createdAt).utc().format('YYYY-MM-DD');

    const closedShortDate =
      issueData.closedAt && issueData.closedAt != null ? moment(issueData.closedAt).utc().format('M/D/YYYY') : '';
    const closedShortDateIso =
      issueData.closedAt && issueData.closedAt != null ? moment(issueData.closedAt).utc().format('YYYY-MM-DD') : '';

    const issueDescription = {
      number: issueData.number,
      title: issueData.title,
      authorLogin: issueData.author.login,
      authorUrl: issueData.author.url,
      repoName: issueData.repository.name,
      repoOwner: issueData.repository.owner.login,
      url: issueData.url,
      labels,
      isClosed,
      isExternal,
      isIssue,
      isOpen,
      isPullRequest,
      createdShortDate,
      createdShortDateIso,
      closedShortDate,
      closedShortDateIso,
      areaLabels,
      kindLabels,
    };
    if (isIssue) {
      return issueDescription;
    }

    // pull request
    const isMerged = isPullRequest && issueData.pullRequestState.toLowerCase() === 'merged';

    const pullRequestDescription: PullRequestDescription = {
      ...issueDescription,
      isMerged,
    };
    return pullRequestDescription;
  }
}
