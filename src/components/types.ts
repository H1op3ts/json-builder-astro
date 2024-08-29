export type TSectionPageMeasurements = {
  scrollTop: number;
  contentWindowHeight: number;
  lineHeight: number;
  occupiedHeight: number | null;
  isLast: boolean;
};

export type TSetMeasurements = (
  sectionIndex: string,
  measurements: TSectionPageMeasurements[]
) => void;

export type TUpdateMeasurements = (
  pageIndex: number,
  sectionIndex: string,
  measurements: Partial<TSectionPageMeasurements>
) => void;
