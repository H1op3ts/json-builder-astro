import range from "lodash/range";
import React, { FC, useEffect, useRef, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import {
  CONTENT,
  CURRENT_FORMAT,
  DEFAULT_GAP,
  DEFAULT_PADDING,
  DIMENSIONS,
  ROW_HEIGHT,
} from "./constants";
import {
  TSectionPageMeasurements,
  TSetMeasurements,
  TUpdateMeasurements,
} from "./types";

type TPlainTextSectionProps = {
  layout: ReactGridLayout.Layout;
  totalOccupiedHeight: number;
  onSetMeasurements: TSetMeasurements;
  onUpdateMeasurements: TUpdateMeasurements;
  gridItemRelativeWidth: number;
  contentStartPageIndex: number;
  pageIndex: number;
  sectionIndex: string;
  isLast;
  contentWindowHeight: number;
  scrollTop;
};

export const PlainTextSection: FC<TPlainTextSectionProps> = (props) => {
  const {
    layout,
    gridItemRelativeWidth,
    totalOccupiedHeight,
    isLast,
    contentWindowHeight,
    contentStartPageIndex,
    scrollTop,
    onSetMeasurements,
    onUpdateMeasurements,
    pageIndex,
    sectionIndex,
  } = props;

  const contentNode = useRef<HTMLDivElement>(null);
  const contentWindowNode = useRef<HTMLDivElement>(null);
  const containerNode = useRef<HTMLDivElement>(null);
  const isMeasured = useRef(false);

  const reservedHeight = DEFAULT_PADDING * 2; //all fixed heights

  const availablePageSectionContainerHeight =
    DIMENSIONS[CURRENT_FORMAT].height - reservedHeight;

  const [actualContainerHeight, setActualContainerHeight] = useState<number>(
    availablePageSectionContainerHeight
  );

  const offsetHeight = layout.y * ROW_HEIGHT; //split offset if it exceeds available height

  const translateX =
    layout.x * gridItemRelativeWidth + (layout.x + 1) * DEFAULT_GAP;

  const translateY =
    contentStartPageIndex === pageIndex
      ? totalOccupiedHeight
        ? totalOccupiedHeight
        : offsetHeight
      : 0;

  useEffect(() => {
    if (!contentNode.current) return;

    const computedStyle = window.getComputedStyle(contentNode.current);

    if (isLast) {
      const actualHeight =
        (parseInt(computedStyle.height) % contentWindowHeight) +
        DEFAULT_PADDING * 2;
      setActualContainerHeight(actualHeight);
      onUpdateMeasurements(pageIndex, sectionIndex, {
        occupiedHeight: actualHeight,
      });
    }
  }, [isLast, contentNode.current, contentWindowHeight]);

  useEffect(() => {
    if (!contentNode.current || !containerNode.current) return;
    const computedStyle = window.getComputedStyle(contentNode.current);
    const lineHeight = parseInt(computedStyle.lineHeight);
    const totalLinesCount = Math.ceil(
      parseInt(computedStyle.height) / lineHeight
    );
    const maxLinesPerPage =
      Math.floor(
        (availablePageSectionContainerHeight - DEFAULT_PADDING * 2) / lineHeight
      ) || 1;
    const pagesCountToFitContent = isNaN(maxLinesPerPage)
      ? 0
      : Math.ceil(totalLinesCount / maxLinesPerPage);

    if (
      !isMeasured.current &&
      contentStartPageIndex === pageIndex &&
      pagesCountToFitContent &&
      !isNaN(pagesCountToFitContent)
    ) {
      const pages = range(0, pagesCountToFitContent + contentStartPageIndex);
      const measurements = pages.map((i: number): TSectionPageMeasurements => {
        return {
          scrollTop: -(maxLinesPerPage * i * lineHeight),
          contentWindowHeight: maxLinesPerPage * lineHeight,
          occupiedHeight: 0,
          isLast: i === pagesCountToFitContent - 1,
        };
      });
      onSetMeasurements(sectionIndex, measurements);
      isMeasured.current = true;
    }
  }, [contentNode.current, layout]);

  const containerComputedStyle = containerNode.current
    ? window.getComputedStyle(containerNode.current)
    : null;

  useEffect(() => {
    if (!containerComputedStyle || !isMeasured.current) {
      return;
    }
    onUpdateMeasurements(pageIndex, sectionIndex, {
      occupiedHeight:
        pageIndex === contentStartPageIndex && !totalOccupiedHeight
          ? parseInt(containerComputedStyle.height) + offsetHeight
          : parseInt(containerComputedStyle.height),
    });
  }, [containerComputedStyle?.height]);

  useEffect(() => {
    if (!isMeasured.current || !totalOccupiedHeight || isLast) {
      return;
    }
    const actualHeight =
      availablePageSectionContainerHeight - totalOccupiedHeight;
    setActualContainerHeight(actualHeight);
  }, [totalOccupiedHeight]);

  const containerStyle: React.CSSProperties = {
    width: gridItemRelativeWidth * layout.w + (layout.w - 1) * DEFAULT_GAP,
    position: "absolute",
    display: "block",
    height: actualContainerHeight ? `${actualContainerHeight}px` : "100%",
    transform: `translate(${translateX}px, ${translateY + DEFAULT_PADDING}px)`,
    padding: DEFAULT_PADDING,
    overflow: "hidden",
  };

  const contentWindowStyle: React.CSSProperties = {
    height: "100%",
    background: "green",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxHeight: contentWindowHeight,
  };

  const contentInnerStyle: React.CSSProperties = {
    top:
      pageIndex === contentStartPageIndex
        ? scrollTop
        : scrollTop + totalOccupiedHeight - DEFAULT_PADDING,
    position: "absolute",
    width: "-webkit-fill-available",
    height: "auto",
  };

  return (
    <div ref={containerNode} style={containerStyle}>
      <div ref={contentWindowNode} style={contentWindowStyle}>
        <div ref={contentNode} style={contentInnerStyle}>
          {sectionIndex === "0" ? CONTENT : <b>{sectionIndex}</b>}
        </div>
      </div>
    </div>
  );
};
