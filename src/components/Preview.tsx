import React, { FC, useEffect, useRef, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import { PlainTextSection } from "./PlainTextSection";
import { TSetMeasurements } from "./types";
import { CURRENT_FORMAT, DEFAULT_GAP, DIMENSIONS } from "./constants";

type TPreviewProps = {
  layout: ReactGridLayout.Layout[];
  colsCount: number;
};

export const Preview: FC<TPreviewProps> = ({ colsCount, layout }) => {
  const [pages, setPages] = useState([
    layout.map((l) => ({
      scrollTop: 0,
      containerHeight: 0,
    })),
  ]);
  const pageRef = useRef(pages);

  useEffect(() => {
    const p = [
      layout.map((l) => ({
        scrollTop: 0,
        containerHeight: 0,
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
    let newPages = [...pageRef.current];
    measurements.forEach((section, i) => {
      newPages[i] ||= [];
      newPages[i][sectionIndex] = section;
    });
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
              border: "1px solid black",
              marginBottom: "10px",
              overflow: "hidden",
              ...DIMENSIONS[CURRENT_FORMAT],
            }}
          >
            {layout.map((l) => {
              if (l.y > 0) {
                return null;
              }

              return (
                <PlainTextSection
                  key={l.i}
                  layout={l}
                  scrollTop={sections[l.i]?.scrollTop}
                  containerHeight={sections[l.i]?.containerHeight}
                  gridItemRelativeWidth={gridItemRelativeWidth}
                  onSetMeasurements={handleSetMeasurements}
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
