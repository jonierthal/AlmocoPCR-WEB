import { InputFilterContainer } from './styles';

type FuncionarioFiltersProps = {
  filterName: string;
  filterId?: number;
  onChangeFilterName: (value: string) => void;
  onChangeFilterId: (value?: number) => void;
};

export function FuncionarioFilters({
  filterName,
  filterId,
  onChangeFilterName,
  onChangeFilterId,
}: FuncionarioFiltersProps) {
  return (
    <InputFilterContainer>
      <span>
        <input
          type="text"
          id="filterName"
          value={filterName}
          onChange={(e) => onChangeFilterName(e.target.value)}
          placeholder="Filtre por nome..."
        />
      </span>
      <span>
        <input
          type="number"
          id="filterId"
          value={filterId ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            onChangeFilterId(value ? parseInt(value) : undefined);
          }}
          placeholder="Filtre por código..."
        />
      </span>
    </InputFilterContainer>
  );
}