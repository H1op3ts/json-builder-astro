import capitalize from "lodash/capitalize";
import map from "lodash/map";
import random from "lodash/random";
import range from "lodash/range";
import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Preview } from "./Preview";
import {
  COLS_COUNT,
  DEFAULT_GAP,
  ROW_HEIGHT,
  SECTIONS_COUNT,
} from "./constants";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

function generateLayout() {
  return map(range(0, SECTIONS_COUNT), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (random(0, 5) * 2) % COLS_COUNT,
      y: Math.floor(i / SECTIONS_COUNT) * y,
      w: 4,
      h: y,
      i: i.toString(),
      static: false,
    };
  });
}

const LAYOUT_1 = [
  {
    x: 0,
    y: 5,
    w: 4,
    h: 5,
    i: "0",
    moved: false,
    static: false,
  },
  {
    x: 3,
    y: 0,
    w: 4,
    h: 2,
    i: "1",
    moved: false,
    static: false,
  },
  {
    x: 3,
    y: 2,
    w: 5,
    h: 3,
    i: "2",
    moved: false,
    static: false,
  },
  {
    x: 8,
    y: 2,
    w: 4,
    h: 4,
    i: "3",
    moved: false,
    static: false,
  },
];

export const ShowLayout = (props) => {
  const { initialLayout = LAYOUT_1, layout } = props;

  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [compactType, setCompactType] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [layouts, setLayouts] = useState({ lg: [] });

  useEffect(() => {
    setMounted(true);
    setLayouts({ lg: initialLayout });
  }, [initialLayout]);

  const generateDOM = () => {
    return map(layouts.lg, function (l, i) {
      return (
        <div key={i} className={l.static ? "static" : ""}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  };

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint);
  };

  const handleLayoutChange = (layout, layouts) => {
    props.onLayoutChange(layout, layouts);
  };

  const pushedLayout = layout.map((l) => ({
    ...l,
    pushedBy: layout
      .filter((la) => {
        const curCols = Array(l.w)
          .fill(0)
          .map((_, i) => l.x + i);
        const compareCols = Array(la.w)
          .fill(0)
          .map((_, i) => la.x + i);

        const hasIntersection = curCols.some((i) => compareCols.includes(i));
        return la.y < l.y && hasIntersection;
      })
      .map((lay) => lay.i),
  }));

  return (
    <div>
      <div>Current Breakpoint</div>
      <div>Compaction type: {capitalize(compactType) || "No Compaction"}</div>
      <ResponsiveReactGridLayout
        {...props}
        margin={[DEFAULT_GAP, DEFAULT_GAP]}
        layouts={layouts}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={handleLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        compactType={compactType}
        rowHeight={ROW_HEIGHT}
        verticalCompact
        preventCollision={!compactType}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
      <Preview layout={pushedLayout} colsCount={COLS_COUNT} />
    </div>
  );
};
