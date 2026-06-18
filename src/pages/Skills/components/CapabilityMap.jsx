import React, { useCallback, useId, useState } from "react";
import { CAPABILITY_CLUSTERS } from "../../../config/cardsConfig.jsx";

const CLUSTER_COUNT = CAPABILITY_CLUSTERS.length;
const RADIUS = 42;

function polarPosition(index) {
  const angle = (360 / CLUSTER_COUNT) * index - 90;
  const rad = (angle * Math.PI) / 180;
  return {
    angle,
    x: 50 + RADIUS * Math.cos(rad),
    y: 50 + RADIUS * Math.sin(rad),
  };
}

export default function CapabilityMap() {
  const [activeId, setActiveId] = useState(CAPABILITY_CLUSTERS[0].id);
  const mapId = useId();

  const handleSelect = useCallback((id) => {
    setActiveId(id);
  }, []);

  return (
    <div className="capability-map">
      <div className="capability-map__stage relative" sa="up-long glacial mirror">
        <div
          className="background__ellipse background__ellipse-1 capability-map__ellipse ellipse--blue ellipse--small absolute"
          aria-hidden="true"
        />

        <svg
          className="capability-map__svg absolute"
          viewBox="0 0 100 100"
          aria-hidden="true"
          focusable="false"
        >
          <circle className="capability-map__ring" cx="50" cy="50" r={RADIUS} />
          {CAPABILITY_CLUSTERS.map((cluster, index) => {
            const { x, y } = polarPosition(index);
            const isActive = cluster.id === activeId;
            return (
              <line
                key={cluster.id}
                className={`capability-map__spoke${isActive ? " is-active" : ""}`}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
              />
            );
          })}
        </svg>

        <div className="capability-map__hub absolute flex-all flex-vert-center flex-horz-center" aria-hidden="true">
          <span className="capability-map__hub-tag">Core</span>
          <span className="capability-map__hub-label">UI Engineering</span>
        </div>

        <div
          className="capability-map__orbit"
          role="tablist"
          aria-label="Capability clusters"
          aria-orientation="horizontal"
        >
          {CAPABILITY_CLUSTERS.map((cluster, index) => {
            const { angle } = polarPosition(index);
            const isActive = cluster.id === activeId;
            const tabId = `${mapId}-tab-${cluster.id}`;
            const panelId = `${mapId}-panel-${cluster.id}`;

            return (
              <button
                key={cluster.id}
                type="button"
                role="tab"
                id={tabId}
                aria-selected={isActive}
                aria-controls={panelId}
                className={`capability-map__node${isActive ? " is-active" : ""}`}
                style={{ "--node-angle": `${angle}deg` }}
                onClick={() => handleSelect(cluster.id)}
                onFocus={() => handleSelect(cluster.id)}
                sa={`up slow mirror delay-${(index + 1) * 100}`}
              >
                <span className="capability-map__node-tag">{cluster.tag}</span>
                <span className="capability-map__node-label">{cluster.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="capability-map__detail">
        {CAPABILITY_CLUSTERS.map((cluster, index) => {
          const isActive = cluster.id === activeId;
          const tabId = `${mapId}-tab-${cluster.id}`;
          const panelId = `${mapId}-panel-${cluster.id}`;

          return (
            <article
              key={cluster.id}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              hidden={!isActive}
              className={`capability-map__panel relative section__grain --grain-medium${isActive ? " is-visible" : ""}`}
              sa={`left-long glacial mirror delay-${(index + 1) * 100}`}
            >
              <header className="capability-map__panel-header">
                <span className="capability-map__panel-tag">{cluster.tag}</span>
                <h3 className="h4">{cluster.label}</h3>
              </header>
              <p className="capability-map__panel-desc">{cluster.description}</p>
              <ul className="capability-map__panel-list">
                {cluster.capabilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}