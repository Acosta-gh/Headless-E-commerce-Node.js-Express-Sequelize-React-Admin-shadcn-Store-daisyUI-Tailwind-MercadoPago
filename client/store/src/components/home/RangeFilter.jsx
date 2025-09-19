function roundUpToNearest(value, nearest = 1000) {
  return Math.ceil(value / nearest) * nearest;
}

// Función para abreviar precios grandes
function formatPrice(value) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`; // Ej: 2.3M
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}mil`; // Ej: 389mil
  }
  return `$${value.toLocaleString("es-AR")}`;
}

function RangeFilter({ min, max, value, setValue }) {
  const steps = [0.25, 0.5, 0.75, 1].map((p) =>
    roundUpToNearest(min + (max - min) * p, 1000)
  );

  const currentStep = steps.findIndex((v) => value <= v);

  return (
    <div className="menu bg-base-200 rounded-box w-full p-2">
      <p className="menu-title">Filtrar por precio</p>
      <input
        type="range"
        min={0}
        max={steps.length - 1}
        step={1}
        value={currentStep === -1 ? steps.length - 1 : currentStep}
        className="range range-xs"
        onChange={(e) => setValue(steps[Number(e.target.value)])}
      />
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        {steps.map((_, i) => (
          <span key={i}>|</span>
        ))}
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        {steps.map((v, i) => (
          <span key={i} className="whitespace-nowrap font-semibold">
            {formatPrice(v)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default RangeFilter;
