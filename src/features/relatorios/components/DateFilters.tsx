import { BiMoveHorizontal } from 'react-icons/bi';
import {
  Button,
  ButtonDateIntervalContainer,
  DateContainer,
  StyledDatePicker,
  TextDate,
  TextDateContainer,
} from '../pages/Relatorios/styles';

type DateFiltersProps = {
  startDate: Date | null;
  endDate: Date | null;
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
  onGenerateReport: () => void;
};

export function DateFilters({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  onGenerateReport,
}: DateFiltersProps) {
  return (
    <DateContainer>
      <TextDateContainer>
        <TextDate>Data Inicial</TextDate>
        <TextDate>Data Final</TextDate>
      </TextDateContainer>
      <ButtonDateIntervalContainer>
        <StyledDatePicker
          selected={startDate}
          onChange={onChangeStartDate}
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          withPortal
        />
        <BiMoveHorizontal size={30} color={'#0476AC'} />
        <StyledDatePicker
          selected={endDate}
          onChange={onChangeEndDate}
          dateFormat="dd/MM/yyyy"
          withPortal
        />
      </ButtonDateIntervalContainer>
      <Button type="button" onClick={onGenerateReport}>
        Gerar Excel por período
      </Button>
    </DateContainer>
  );
}