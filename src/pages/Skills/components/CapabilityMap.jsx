import React, { useCallback, useId, useState } from "react";
import { CAPABILITY_CLUSTERS } from "../../../config/cardsConfig.jsx";

const CLUSTER_COUNT = CAPABILITY_CLUSTERS.length;
const RING_RADIUS = 44;

function polarPosition(index) {
  const angle = (360 / CLUSTER_COUNT) * index - 90;
  const rad = (angle * Math.PI) / 180;
  const x = 50 + RING_RADIUS * Math.cos(rad);
  const y = 50 + RING_RADIUS * Math.sin(rad);
  return { angle, x, y };
}

export default function CapabilityMap() {
  const [activeId, setActiveId] = useState(CAPABILITY_CLUSTERS[0].id);
  const mapId = useId();

  const activeCluster =
    CAPABILITY_CLUSTERS.find((cluster) => cluster.id === activeId) ??
    CAPABILITY_CLUSTERS[0];

  const handleSelect = useCallback((id) => {
    setActiveId(id);
  }, []);

  const handleTabClick = useCallback(
    (event, id) => {
      event.currentTarget.focus({ preventScroll: true });
      handleSelect(id);
    },
    [handleSelect]
  );

  return (
    <div className="capability-map">
      <div className="capability-map__stage relative" sa="up-long glacial mirror">
        <div className="capability-map__visual absolute" aria-hidden="true">
          <div
            className="background__ellipse background__ellipse-1 capability-map__ellipse ellipse--primary ellipse--small absolute"
          />
          <svg
            className="capability-map__svg"
            viewBox="0 0 100 100"
            focusable="false"
          >
            <circle className="capability-map__ring" cx="50" cy="50" r={RING_RADIUS} />
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
        </div>

        <div
          className="capability-map__orbit"
          role="tablist"
          aria-label="Capability clusters"
        >
          {CAPABILITY_CLUSTERS.map((cluster, index) => {
            const { x, y } = polarPosition(index);
            const isActive = cluster.id === activeId;
            const tabId = `${mapId}-tab-${cluster.id}`;
            const panelId = `${mapId}-panel-${activeId}`;

            return (
              <button
                key={cluster.id}
                type="button"
                role="tab"
                id={tabId}
                aria-selected={isActive}
                aria-controls={panelId}
                className={`capability-map__node${isActive ? " is-active" : ""}`}
                style={{
                  "--node-x": `${x}%`,
                  "--node-y": `${y}%`,
                }}
                onClick={(event) => handleTabClick(event, cluster.id)}
                sa={`up slow mirror delay-${(index + 1) * 100}`}
              >
                <span className="capability-map__node-tag">{cluster.tag}</span>
                <span className="capability-map__node-label">{cluster.label}</span>
              </button>
            );
          })}
        </div>

        <div className="capability-map__center">
          <article
            key={activeCluster.id}
            id={`${mapId}-panel-${activeCluster.id}`}
            role="tabpanel"
            aria-labelledby={`${mapId}-tab-${activeCluster.id}`}
            className="capability-map__panel relative section__grain --grain-medium is-visible"
            sa="up glacial mirror delay-200"
          >
            <header className="capability-map__panel-header">
              <span className="capability-map__panel-tag">{activeCluster.tag}</span>
              <h3 className="h4">{activeCluster.label}</h3>
            </header>
            <p className="capability-map__panel-desc">{activeCluster.description}</p>
            <ul className="capability-map__panel-list">
              {activeCluster.capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </div>
  );
}