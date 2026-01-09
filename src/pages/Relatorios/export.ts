import * as XLSX from 'xlsx';
import XlsxStyle from 'xlsx-js-style';
import {
  AlmocoExtraType,
  AlmocoType,
  AlmocosPeriodoType,
  ReservaXisPeriodoType,
  ReservaXisType,
} from './types';

export const tableHeader = {
  fill: {
    type: 'pattern',
    patternType: 'solid',
    fgColor: { rgb: 'FFFF00' },
  },
  font: {
    bold: true,
  },
  alignment: {
    vertical: 'center',
    horizontal: 'center',
  },
  border: {
    bottom: { style: 'thin' },
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  },
  numFmt: '0',
};

export const tableHeaderTitles = {
  fill: {
    type: 'pattern',
    patternType: 'solid',
    fgColor: { rgb: '00B0F0' },
  },
  font: {
    bold: true,
  },
  alignment: {
    vertical: 'center',
    horizontal: 'center',
  },
  border: {
    bottom: { style: 'thin' },
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  },
};

export const thinBorder = {
  border: {
    bottom: { style: 'thin' },
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  },
  alignment: {
    vertical: 'center',
    horizontal: 'center',
  },
  numFmt: '0',
};

export const dateStyle = {
  ...thinBorder,
  numFmt: 'dd/mm/yyyy',
};

const thinBorderSimple = {
  border: {
    bottom: { style: 'thin' },
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  },
  alignment: {
    vertical: 'center',
    horizontal: 'center',
  },
};

type RelatorioPeriodoParams = {
  startDate: Date;
  endDate: Date;
  almocosPeriodo: AlmocosPeriodoType[];
  almocosExtrasPeriodo: AlmocoExtraType[];
  reservaXisPeriodo: ReservaXisPeriodoType[];
  total: number;
};

export function exportRelatorioPeriodo({
  startDate,
  endDate,
  almocosPeriodo,
  almocosExtrasPeriodo,
  reservaXisPeriodo,
  total,
}: RelatorioPeriodoParams) {
  const almocosPeriodoRows = almocosPeriodo.map((almocoPeriodo) => [
    almocoPeriodo.nome,
    almocoPeriodo.setor_nome || '',
    almocoPeriodo.quantidade,
  ]);
  const almocosExtrasRows = almocosExtrasPeriodo.map((almocoExtrasPeriodo) => [
    '',
    almocoExtrasPeriodo.nome_aext,
    almocoExtrasPeriodo.quantidade_aext,
  ]);
  const reservaXisRows = reservaXisPeriodo.map((reservaXis) => [
    '',
    reservaXis.nome,
    reservaXis.setor_nome || '',
    reservaXis.quantidade_rx,
  ]);

  const maxLength = Math.max(
    almocosPeriodoRows.length,
    almocosExtrasRows.length,
    reservaXisRows.length,
  );

  const dados = [] as Array<string | number | null>[][];
  for (let i = 0; i < maxLength; i += 1) {
    const almocoRow = almocosPeriodoRows[i] || ['', ''];
    const almocoExtrasRow = almocosExtrasRows[i] || ['', '', ''];
    const reservaXisRow = reservaXisRows[i] || ['', '', ''];

    dados.push([...almocoRow, ...almocoExtrasRow, ...reservaXisRow]);
  }

  const planilha = XLSX.utils.aoa_to_sheet([
    ['DATA INICIO', 'DATA FIM'],
    [startDate, endDate],
    [null],
    [
      'NOME',
      'DEPARTAMENTO',
      'QUANTIDADE',
      '',
      'NOME ALMOCO EXTRA',
      'QUANTIDADE',
      '',
      'NOME RESERVA XIS',
      'DEPARTAMENTO',
      'QUANTIDADE',
      '',
      'TOTAL',
    ],
    ...dados,
  ]);

  planilha['L5'] = { v: total, t: 'n' };

  planilha['A1'].s = tableHeader;
  planilha['B1'].s = tableHeader;
  planilha['A4'].s = tableHeader;
  planilha['B4'].s = tableHeader;
  planilha['C4'].s = tableHeader;

  planilha['E4'].s = tableHeader;
  planilha['F4'].s = tableHeader;

  planilha['H4'].s = tableHeader;
  planilha['I4'].s = tableHeader;
  planilha['J4'].s = tableHeader;

  planilha['L4'].s = tableHeader;
  planilha['A2'].s = dateStyle;
  planilha['B2'].s = dateStyle;

  planilha['L5'].s = thinBorder;

  for (let i = 5; i <= almocosPeriodoRows.length + 4; i += 1) {
    const cellRef = `A${i}`;
    planilha[cellRef].s = thinBorder;
  }

  for (let i = 5; i <= almocosPeriodoRows.length + 4; i += 1) {
    const cellRef = `B${i}`;
    planilha[cellRef].s = thinBorder;
  }

  for (let i = 5; i <= almocosPeriodoRows.length + 4; i += 1) {
    const cellRef = `C${i}`;
    planilha[cellRef].s = thinBorder;
  }

  for (let i = 5; i <= almocosExtrasRows.length + 4; i += 1) {
    const cellRef = `E${i}`;
    planilha[cellRef].s = thinBorder;
  }

  for (let i = 5; i <= almocosExtrasRows.length + 4; i += 1) {
    const cellRef = `F${i}`;
    planilha[cellRef].s = thinBorder;
  }

  for (let i = 5; i <= reservaXisRows.length + 4; i += 1) {
    const cellRef = `H${i}`;
    planilha[cellRef].s = thinBorder;
  }

  for (let i = 5; i <= reservaXisRows.length + 4; i += 1) {
    const cellRef = `I${i}`;
    planilha[cellRef].s = thinBorder;
  }

  for (let i = 5; i <= reservaXisRows.length + 4; i += 1) {
    const cellRef = `J${i}`;
    planilha[cellRef].s = thinBorder;
  }

  planilha['!cols'] = [
    { width: 40 },
    { width: 30 },
    { width: 15 },
    { width: 5 },
    { width: 40 },
    { width: 15 },
    { width: 5 },
    { width: 40 },
    { width: 30 },
    { width: 15 },
    { width: 5 },
    { width: 15 },
  ];

  const livro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(livro, planilha, 'Relatório período');
  XlsxStyle.writeFile(livro, 'relatorio-periodo.xlsx');
}

export function exportRelatorioXis(reservas: ReservaXisType[]) {
  const reservasRows = reservas.map((reserva) => [
    reserva['Funcionario.nome'],
    reserva['Funcionario.Setor.nome'] || '',
    reserva.quantidade_rx,
  ]);

  const planilha = XLSX.utils.aoa_to_sheet([
    ['Funcionário', 'Departamento', 'Quantidade'],
    ...reservasRows,
  ]);

  planilha['A1'].s = tableHeader;
  planilha['B1'].s = tableHeader;
  planilha['C1'].s = tableHeader;

  for (let i = 2; i <= reservasRows.length + 1; i += 1) {
    const cellRef = `A${i}`;
    planilha[cellRef].s = thinBorder;
  }

  for (let i = 2; i <= reservasRows.length + 1; i += 1) {
    const cellRef = `B${i}`;
    planilha[cellRef].s = thinBorder;
  }

  for (let i = 2; i <= reservasRows.length + 1; i += 1) {
    const cellRef = `C${i}`;
    planilha[cellRef].s = thinBorder;
  }

  planilha['!cols'] = [{ width: 40 }, { width: 15 }, { width: 15 }];

  const livro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(livro, planilha, 'Reservas de Xis');

  XlsxStyle.writeFile(livro, 'relatorio-xis.xlsx');
}

type RelatorioAlmocoParams = {
  almocos: AlmocoType[];
  almocosExtra: AlmocoExtraType[];
  numAlmocos: number;
  numAlmocosExtra: number;
};

export function exportRelatorioAlmoco({
  almocos,
  almocosExtra,
  numAlmocos,
  numAlmocosExtra,
}: RelatorioAlmocoParams) {
  const reservas = almocos.map((almoco) => [
    almoco.cod_funcionario,
    almoco['Funcionario.nome'],
    almoco['Funcionario.Setor.nome'] || '',
  ]);

  const extras = almocosExtra.map((extra) => [
    '',
    '',
    extra.nome_aext,
    extra.quantidade_aext,
  ]);

  const dados = reservas.map((reserva, index) => [
    ...reserva,
    ...(extras[index] || ['', '']),
  ]);

  const planilha = XLSX.utils.aoa_to_sheet([
    [
      'RESERVAS DE ALMOÇO',
      '',
      '',
      '',
      '',
      'RESERVAS EXTRAS',
      '',
      '',
      '',
      'TOTAL RESERVAS+EXTRAS',
    ],
    ['Código', 'Funcionário', 'Departamento', 'TOTAL', '', 'Nome Almoço Extra', 'Quantidade', 'TOTAL'],
    ...dados,
  ]);

  planilha['D3'] = { v: numAlmocos, t: 'n' };
  planilha['H3'] = { v: numAlmocosExtra, t: 'n' };
  planilha['J2'] = { v: numAlmocosExtra + numAlmocos, t: 'n' };

  planilha['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 0, c: 5 }, e: { r: 0, c: 7 } },
  ];

  planilha['A1'].s = tableHeaderTitles;
  planilha['F1'].s = tableHeaderTitles;

  planilha['A2'].s = tableHeader;
  planilha['B2'].s = tableHeader;
  planilha['C2'].s = tableHeader;
  planilha['D2'].s = tableHeader;

  planilha['F2'].s = tableHeader;
  planilha['G2'].s = tableHeader;
  planilha['H2'].s = tableHeader;

  planilha['J1'].s = tableHeader;

  for (let i = 3; i <= reservas.length + 2; i += 1) {
    const cellRef = `A${i}`;
    planilha[cellRef].s = thinBorderSimple;
  }

  for (let i = 3; i <= reservas.length + 2; i += 1) {
    const cellRef = `B${i}`;
    planilha[cellRef].s = thinBorderSimple;
  }

  for (let i = 3; i <= reservas.length + 2; i += 1) {
    const cellRef = `C${i}`;
    planilha[cellRef].s = thinBorderSimple;
  }

  for (let i = 3; i <= extras.length + 2; i += 1) {
    const cellRef = `F${i}`;
    planilha[cellRef].s = thinBorderSimple;
  }

  for (let i = 3; i <= extras.length + 2; i += 1) {
    const cellRef = `G${i}`;
    planilha[cellRef].s = thinBorderSimple;
  }

  planilha['D3'].s = thinBorderSimple;
  planilha['H3'].s = thinBorderSimple;
  planilha['J2'].s = thinBorderSimple;

  planilha['!cols'] = [
    { width: 15 },
    { width: 40 },
    { width: 30 },
    { width: 15 },
    { width: 5 },
    { width: 40 },
    { width: 15 },
    { width: 15 },
    { width: 5 },
    { width: 30 },
  ];

  const livro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(livro, planilha, 'Reservas de Almoço');

  XlsxStyle.writeFile(livro, 'relatorio-almoco.xlsx');
}