import range from "lodash/range";
import React, { FC, useEffect, useRef, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import {
  CONTENT,
  CURRENT_FORMAT,
  DEFAULT_GAP,
  DEFAULT_PADDING,
  DIMENSIONS,
} from "./constants";
import { TSetMeasurements } from "./types";

type TSectionPageMeasurements = {
  scrollTop: number;
  containerHeight: number;
  index: number;
  isLast: boolean;
};

type TPlainTextSectionProps = {
  layout: ReactGridLayout.Layout;
  scrollTop: number;
  containerHeight: number;
  isLast: boolean;
  onSetMeasurements: TSetMeasurements;
  gridItemRelativeWidth: number;
  pageIndex: number;
  sectionIndex: string;
};

export const PlainTextSection: FC<TPlainTextSectionProps> = ({
  layout,
  gridItemRelativeWidth,
  scrollTop = 0,
  containerHeight = 0,
  isLast,
  onSetMeasurements,
  pageIndex,
  sectionIndex,
}) => {
  const contentNode = useRef(null);
  const contentWindowNode = useRef(null);

  const reservedHeight = DEFAULT_GAP * 2; //all fixed heights

  const [contentWindowHeight, setH] = useState("100%");

  useEffect(() => {
    if (!contentNode.current) return;
    const computedStyle = window.getComputedStyle(contentNode.current);
    setH(
      isLast ? `${parseInt(computedStyle.height) % containerHeight}px` : "100%"
    );
    const lineHeight = parseInt(computedStyle.lineHeight);
    const totalLinesCount = Math.ceil(
      parseInt(computedStyle.height) / lineHeight
    );

    const availablePageSectionHeight =
      DIMENSIONS[CURRENT_FORMAT].height - reservedHeight - DEFAULT_PADDING * 2; //calc available height if some content present

    containerHeight ||=
      contentWindowNode.current?.offsetHeight || availablePageSectionHeight;

    const maxLinesPerPage = Math.floor(containerHeight / lineHeight) || 1;

    const pagesCountToFitContent = isNaN(maxLinesPerPage)
      ? 0
      : Math.ceil(totalLinesCount / maxLinesPerPage);
    if (
      pageIndex === 0 &&
      pagesCountToFitContent &&
      !isNaN(pagesCountToFitContent)
    ) {
      const pages = range(0, pagesCountToFitContent);
      const measurements = pages.map((i: number): TSectionPageMeasurements => {
        return {
          scrollTop: -(maxLinesPerPage * i * lineHeight),
          containerHeight: maxLinesPerPage * lineHeight,
          index: i,
          isLast: i === pagesCountToFitContent - 1,
        };
      });
      onSetMeasurements(sectionIndex, measurements);
    }
  }, [contentNode.current, layout, isLast]);

  const containerStyle: React.CSSProperties = {
    width: gridItemRelativeWidth * layout.w + (layout.w - 1) * DEFAULT_GAP,
    position: "absolute",
    height: `calc(100% - ${reservedHeight}px)`,
    transform: `translate(${
      layout.x * gridItemRelativeWidth + (layout.x + 1) * DEFAULT_GAP
    }px, ${(layout.y + 1) * DEFAULT_GAP}px)`,
    padding: DEFAULT_PADDING,
    overflow: "hidden",
  };

  const contentWindowStyle: React.CSSProperties = {
    height: contentWindowHeight,
    background: "green",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxHeight: containerHeight,
  };

  const contentInnerStyle: React.CSSProperties = {
    top: scrollTop,
    position: "absolute",
    width: "-webkit-fill-available",
    height: "auto",
  };

  return (
    <div style={containerStyle}>
      <div ref={contentWindowNode} style={contentWindowStyle}>
        <div ref={contentNode} style={contentInnerStyle}>
          {sectionIndex === "0" ? CONTENT : <b>{sectionIndex}</b>}
        </div>
      </div>
    </div>
  );
};
