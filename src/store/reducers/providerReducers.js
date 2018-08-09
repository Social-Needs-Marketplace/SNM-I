import _ from 'lodash';

import { RECEIVE_PROVIDER, REQUEST_PROVIDER, SEARCH_PROVIDERS, REQUEST_PROVIDERS, RECEIVE_PROVIDERS,
          RECEIVE_NEW_PROVIDER, REMOVE_PROVIDER, RECEIVE_NEW_PROVIDERS_CSV } from '../actions/providerActions.js'


export function providers(state = {index: [], byId: {}, loaded: false, value: '', filteredProviders: []}, action) {
  let nextIndex, nextById, providers, prevIndex;
  switch (action.type) {
    case REQUEST_PROVIDERS:
      return {...state, loaded: false};
    case RECEIVE_PROVIDERS:
      const providersById = _.keyBy(action.info.providers, provider => provider.id);
      return {...state, byId: providersById, index: action.info.providers, filteredProviders: action.info.providers,
              providersByService: action.info.providersByService, loaded: true};
    case RECEIVE_NEW_PROVIDER:
      nextIndex = [action.provider, ...state.index]
      return {...state, index: nextIndex}
    case RECEIVE_NEW_PROVIDERS_CSV:
      nextIndex = [...state.index]
      for (var i=0; i < action.providers.providers.length; i++) {
        nextIndex.push(action.providers.providers[i]);
      }
      return {...state, index: nextIndex}
    case REMOVE_PROVIDER:
      nextIndex = _.clone(state.index);
      _.remove(nextIndex, (n) => { return n.id === action.id });
      return {...state, index: nextIndex, filteredProviders: nextIndex}
    case RECEIVE_PROVIDER:
      nextById = {...state.byId, [action.id]: { ...action.info.provider, loaded: true, services: action.info.services }}
      return {...state, byId: nextById }
    case REQUEST_PROVIDER:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return {...state, byId: nextById }
    default:
      return state
  }
}
