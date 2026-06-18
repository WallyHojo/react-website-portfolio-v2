import "./OverviewList.css";

function OverviewListItem({ label, value, prefix, suffix, saDelay }) {
  return (
    <li sa={`diag-tr-bl slow delay-${saDelay}`}>
      <div className="overview__list-stat flex-all flex-direction-column">
        <div className="stat__number">
          <span className="stat__value flex-all flex-vert-center" sa="count mirror delay-400" {...(prefix && { "data-sa-prefix": prefix })} data-sa-to={value} data-sa-suffix={suffix}></span>
        </div>
        <p className="stat__label">{label}</p>
      </div>
    </li>
  );
}

export default function OverviewList({ items }) {
  return (
    <ul className="overview__list">
      {items.map((item, index) => {
        const { key, ...rest } = item;
        return <OverviewListItem key={key} {...rest} saDelay={(index + 1) * 200} />;
      })}
    </ul>
  );
}