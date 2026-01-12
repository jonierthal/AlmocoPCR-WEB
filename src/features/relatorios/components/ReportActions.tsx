import { Button, ButtonContainer } from '../pages/Relatorios/styles';

type ReportActionsProps = {
  onGerarRelatorioAlmoco: () => void;
  onGerarRelatorioXis: () => void;
};

export function ReportActions({
  onGerarRelatorioAlmoco,
  onGerarRelatorioXis,
}: ReportActionsProps) {
  return (
    <ButtonContainer>
      <Button type="button" onClick={onGerarRelatorioAlmoco}>
        Reservar Almoço
      </Button>
      <Button type="button" onClick={onGerarRelatorioXis}>
        Reserva Xis
      </Button>
    </ButtonContainer>
  );
}