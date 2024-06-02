import React, { FC, useEffect, useRef, useState } from "react";
import range from "lodash/range";
import { DEFAULT_GAP, DEFAULT_PADDING } from "./ShowLayout";
import ReactGridLayout from "react-grid-layout";
import { TSetMeasurements } from "./types";
import {
  CONTENT,
  CURRENT_FORMAT,
  DEFAULT_LINEHEIGHT,
  DIMENSIONS,
} from "./constants";

type TSectionPageMeasurements = {
  scrollTop: number;
  containerHeight: number;
};

type TPlainTextSectionProps = {
  layout: ReactGridLayout.Layout;
  scrollTop: number;
  containerHeight: number;
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
  onSetMeasurements,
  pageIndex,
  sectionIndex,
}) => {
  const contentNode = useRef(null);
  const containerNode = useRef(null);

  const reservedHeight = DEFAULT_GAP * 2; //all fixed heights

  useEffect(() => {
    const lineHeight = parseInt(
      contentNode?.current
        ? window.getComputedStyle(contentNode.current).lineHeight
        : DEFAULT_LINEHEIGHT.toString()
    );
    const computedStyle = contentNode.current
      ? window.getComputedStyle(contentNode.current)
      : null;
    const totalLinesCount = computedStyle
      ? Math.ceil(parseInt(computedStyle.height) / lineHeight)
      : 0;

    const availablePageSectionHeight =
      DIMENSIONS[CURRENT_FORMAT].height - reservedHeight - DEFAULT_PADDING * 2; //calc available height if some content present

    containerHeight ||=
      containerNode.current?.offsetHeight || availablePageSectionHeight;

    const maxLinesPerPage = Math.floor(containerHeight / lineHeight) || 1;

    const pagesCountToFitContent = isNaN(maxLinesPerPage)
      ? 1
      : Math.ceil(totalLinesCount / maxLinesPerPage);
    if (
      pageIndex === 0 &&
      pagesCountToFitContent &&
      !isNaN(pagesCountToFitContent)
    ) {
      const measurements = range(0, pagesCountToFitContent).map(
        (i: number): TSectionPageMeasurements => {
          return {
            scrollTop: -(maxLinesPerPage * i * lineHeight),
            containerHeight: maxLinesPerPage * lineHeight,
          };
        }
      );
      onSetMeasurements(sectionIndex, measurements);
    }
  }, [contentNode.current, layout]);

  const style: React.CSSProperties = {
    width: gridItemRelativeWidth * layout.w + (layout.w - 1) * DEFAULT_GAP,
    position: "absolute",
    //maxHeight: containerHeight,
    height: `calc(100% - ${reservedHeight}px)`,
    transform: `translate(${
      layout.x * gridItemRelativeWidth + (layout.x + 1) * DEFAULT_GAP
    }px, ${(layout.y + 1) * DEFAULT_GAP}px)`,
    padding: DEFAULT_PADDING,
    background: "green",
    overflow: "hidden",
  };

  const contentWindowStyle: React.CSSProperties = {
    height: "100%",
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
    <div style={style}>
      <div ref={containerNode} style={contentWindowStyle}>
        <div ref={contentNode} style={contentInnerStyle}>
          {layout.i === "0" ? CONTENT : <b>{layout.i}</b>}
        </div>
      </div>
    </div>
  );
};
