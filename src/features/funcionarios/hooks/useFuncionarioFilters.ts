import { useState } from 'react';

type UseFuncionarioFiltersResult = {
  filterName: string;
  filterId: number | undefined;
  onChangeFilterName: (value: string) => void;
  onChangeFilterId: (value: number | undefined) => void;
};

export function useFuncionarioFilters(): UseFuncionarioFiltersResult {
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState<number>();

  return {
    filterName,
    filterId,
    onChangeFilterName: setFilterName,
    onChangeFilterId: setFilterId,
  };
}