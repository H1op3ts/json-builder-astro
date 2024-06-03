import React, { useEffect, useState } from "react";
import map from "lodash/map";
import capitalize from "lodash/capitalize";
import random from "lodash/random";
import range from "lodash/range";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Preview } from "./Preview";
import { COLS_COUNT, DEFAULT_GAP, SECTIONS_COUNT } from "./constants";
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

export const ShowLayout = (props) => {
  const { initialLayout = generateLayout(), layout } = props;

  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [compactType, setCompactType] = useState("horizontal");
  const [mounted, setMounted] = useState(false);
  const [layouts, setLayouts] = useState({ lg: initialLayout });

  useEffect(() => {
    setMounted(true);
  }, []);

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
        preventCollision={!compactType}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
      <Preview layout={layout} colsCount={COLS_COUNT} />
    </div>
  );
};
