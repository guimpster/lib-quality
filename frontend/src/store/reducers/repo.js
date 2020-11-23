import { createReducer, createActions } from 'reduxsauce';


export const INITIAL_STATE = {
  repos: {},
};

export const { Types, Creators } = createActions({
  addRepo: {
    repo: null,
  },
  removeRepo: {
    repoId: null
  },
  addRepoSuccess: {
    repo: null
  },
  addRepoError: {
    error: null
  }
});

export const addRepo = (state = INITIAL_STATE) => ({ ...state });
export const addRepoSuccess = (state = INITIAL_STATE, { repo }) => {
  return ({ ...state, repo: { [repo.id]: repo, ...state.repo }  });
}
export const addRepoError = (state = INITIAL_STATE) => ({ ...state });
export const removeRepo = (state = INITIAL_STATE, { payload }) => {
  const repo = { ...state.repo }
  delete repo[payload]
  return {
    ...state,
    repo
  }
}

const repoReducer = createReducer(INITIAL_STATE, {
  [Types.ADD_REPO]: addRepo,
  [Types.REMOVE_REPO]: removeRepo,
  [Types.ADD_REPO_SUCCESS]: addRepoSuccess,
  [Types.ADD_REPO_ERROR]: addRepoError
});

export default repoReducer;
