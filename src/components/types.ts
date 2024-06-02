export type TSectionPageMeasurements = {
  scrollTop: number;
  containerHeight: number;
};

export type TSetMeasurements = (
  sectionIndex: string,
  measurements: TSectionPageMeasurements[]
) => void;
