import React, { FC, useState } from "react";
import { ShowLayout } from "./ShowLayout";

export const GridLayout: FC = () => {
  const [layout, setLayout] = useState<any>([]);

  const stringifyLayout = () => {
    return layout.map(function (l) {
      return (
        <div className="layoutItem" key={l.i}>
          <b>{l.i}</b>: [{l.x}, {l.y}, {l.w}, {l.h}]
        </div>
      );
    });
  };

  return (
    <div>
      <div className="layoutJSON">
        Displayed as <code>[x, y, w, h]</code>:
        <div className="columns">{stringifyLayout()}</div>
      </div>
      <ShowLayout layout={layout} onLayoutChange={setLayout} />
    </div>
  );
};
