export default function Placeholder({ title }) {
  return (
    <>
      <div className="page-head"><h2>{title}</h2></div>
      <div className="panel empty">This module is next on the build list. The route and sidebar link are already wired up.</div>
    </>
  );
}
