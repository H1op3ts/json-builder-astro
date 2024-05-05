import React, { useEffect, useState } from "react";
import map from "lodash/map";
import capitalize from "lodash/capitalize";
import random from "lodash/random";
import range from "lodash/range";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

function generateLayout() {
  return map(range(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: false,
    };
  });
}

export const ShowLayout = (props) => {
  const {
    className = "layout",
    rowHeight = 30,
    onLayoutChange = function () {},
    cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    initialLayout = generateLayout(),
  } = props;

  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [compactType, setCompactType] = useState("vertical");
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

  const onCompactTypeChange = () => {
    const newCompactType =
      compactType === "horizontal"
        ? "vertical"
        : compactType === "vertical"
        ? null
        : "horizontal";
    setCompactType(newCompactType);
  };

  const handleLayoutChange = (layout, layouts) => {
    props.onLayoutChange(layout, layouts);
  };

  const onNewLayout = () => {
    setLayouts({ lg: generateLayout() });
  };

  console.log(layouts);

  return (
    <div>
      <div>
        Current Breakpoint: {currentBreakpoint} ({cols[currentBreakpoint]}{" "}
        columns)
      </div>
      <div>Compaction type: {capitalize(compactType) || "No Compaction"}</div>
      <button onClick={onNewLayout}>Generate New Layout</button>
      <button onClick={onCompactTypeChange}>Change Compaction Type</button>
      <ResponsiveReactGridLayout
        {...props}
        layouts={layouts}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={handleLayoutChange}
        // WidthProvider option
        measureBeforeMount={false}
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={mounted}
        compactType={compactType}
        preventCollision={!compactType}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
};
