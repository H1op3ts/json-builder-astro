import React, { FC, useEffect, useRef, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import { CURRENT_FORMAT, DEFAULT_GAP, DIMENSIONS } from "./constants";
import { PlainTextSection } from "./PlainTextSection";
import {
  TSectionPageMeasurements,
  TSetMeasurements,
  TUpdateMeasurements,
} from "./types";

type TPreviewProps = {
  layout: (ReactGridLayout.Layout & { shiftedByTree: string[][] })[];
  colsCount: number;
};

const DEFAULT_MEASUREMENT = {
  scrollTop: 0,
  contentWindowHeight: 0,
  occupiedHeight: null,
  isLast: true,
};

export const Preview: FC<TPreviewProps> = ({ colsCount, layout }) => {
  const [pages, setPages] = useState([
    layout.map<TSectionPageMeasurements>((l, i) => ({
      ...DEFAULT_MEASUREMENT,
      index: i,
    })),
  ]);
  const pageRef = useRef(pages);

  useEffect(() => {
    const p = [
      layout.map((l, i) => ({
        ...DEFAULT_MEASUREMENT,
        index: i,
      })),
    ];
    setPages(p);

    pageRef.current = p;
  }, []);

  const handleSetMeasurements: TSetMeasurements = (
    sectionIndex,
    measurements
  ) => {
    if (sectionIndex === "0") {
      pageRef.current = [];
    }
    const newPages = [...pageRef.current];
    measurements.forEach((section, i) => {
      newPages[i] ||= [];
      newPages[i][sectionIndex] = section;
    });
    setPages(newPages);
    pageRef.current = newPages;
  };

  const handleUpdateMeasurements: TUpdateMeasurements = (
    pageIndex,
    sectionIndex,
    measurements
  ) => {
    const newPages = [...pageRef.current];
    newPages[pageIndex][sectionIndex] = {
      ...newPages[pageIndex][sectionIndex],
      ...measurements,
    };
    setPages(newPages);
    pageRef.current = newPages;
  };

  const gapsWidth = (colsCount + 1) * DEFAULT_GAP;
  const gridItemRelativeWidth =
    (DIMENSIONS[CURRENT_FORMAT].width - gapsWidth) / colsCount;

  return (
    <div>
      {pageRef.current.map((sections, pageIndex) => {
        return (
          <div
            key={pageIndex}
            style={{
              position: "relative",
              outline: "1px solid black",
              marginBottom: "10px",
              overflow: "hidden",
              ...DIMENSIONS[CURRENT_FORMAT],
            }}
          >
            {layout.map((l) => {
              const section: TSectionPageMeasurements = sections[l.i];

              if (pageIndex > 0 && !section) {
                return null;
              }

              let actualShiftedBy: string[] = [];
              let maxShift = 0;

              l.shiftedByTree.forEach((shiftedBy) => {
                const shift = shiftedBy.reduce((acc, i) => {
                  acc += sections[parseInt(i)]?.occupiedHeight || 0;
                  return acc;
                }, 0);

                if (shift > maxShift) {
                  maxShift = shift;
                  actualShiftedBy = shiftedBy;
                }
              });

              const totalOccupiedHeight = l.shiftedByTree.length
                ? maxShift + actualShiftedBy.length * DEFAULT_GAP // include gaps
                : 0;

              // calculate pageOccupiedHeight
              // include empty rows between shifts and layout section

              const contentStartPageIndex = l.shiftedByTree.length
                ? pageRef.current.reduce((result, sections, i) => {
                    if (actualShiftedBy.some((i) => sections[parseInt(i)])) {
                      result = i;
                    }
                    return result;
                  }, 0)
                : 0;

              return (
                <PlainTextSection
                  key={`${l.i}_${pageIndex}`}
                  layout={l}
                  isLast={section?.isLast}
                  contentWindowHeight={section?.contentWindowHeight}
                  scrollTop={section?.scrollTop}
                  totalOccupiedHeight={totalOccupiedHeight}
                  gridItemRelativeWidth={gridItemRelativeWidth}
                  contentStartPageIndex={contentStartPageIndex}
                  onSetMeasurements={handleSetMeasurements}
                  onUpdateMeasurements={handleUpdateMeasurements}
                  pageIndex={pageIndex}
                  sectionIndex={l.i}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
