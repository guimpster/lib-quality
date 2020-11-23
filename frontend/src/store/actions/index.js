import { action } from '../index';

export function addRepo(repoName) {
  return action('ADD_REPO', repoName);
}

export function removeRepo(repoId) {
  return action('REMOVE_REPO', repoId);
}
