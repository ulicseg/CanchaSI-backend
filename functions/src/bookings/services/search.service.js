import * as searchRepository from '../repositories/search.repository.js';

export const listComplexes = async ({ ownerId, name, limit = 50 }) => {
  return await searchRepository.findComplexes({ ownerId, name, limit });
};

export const getComplexById = async (id) => {
  return await searchRepository.findComplexById(id);
};
