function chooseNearestStep(range) {
  if (range < 100) return 10;
  if (range < 1000) return 50;
  if (range < 10000) return 100;
  if (range < 50000) return 500;
  return 1000;
}

function roundUpToNearest(value, nearest) {
  return Math.ceil(value / nearest) * nearest;
}

function formatPrice(value) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}mil`;
  }
  return `$${value.toLocaleString("es-AR")}`;
}

function RangeFilter({ min, max, value, setValue }) {
  const range = max - min;
  const nearest = chooseNearestStep(range);

  const steps = [
    min,
    roundUpToNearest(min + range * 0.25, nearest),
    roundUpToNearest(min + range * 0.5, nearest),
    roundUpToNearest(min + range * 0.75, nearest),
    roundUpToNearest(max, nearest),
  ];

  const uniqueSteps = [...new Set(steps)];
  const currentStep = uniqueSteps.findIndex((v) => value <= v);
  const sliderValue = currentStep === -1 ? uniqueSteps.length - 1 : currentStep;

  return (
    <div className="menu bg-base-200 rounded-box w-full p-2">
      <p className="menu-title">Filtrar por precio</p>
      <input
        type="range"
        min={0}
        max={uniqueSteps.length - 1}
        step={1}
        value={sliderValue}
        className="range range-xs"
        onChange={(e) => setValue(uniqueSteps[Number(e.target.value)])}
      />
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        {uniqueSteps.map((_, i) => (
          <span key={i}>|</span>
        ))}
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        {uniqueSteps.map((v, i) => {
          // Mostrar solo el primero, el último y el seleccionado
          //const isEdge = i === 0 || i === uniqueSteps.length - 1;
          const isEdge = i === 0;
          const isSelected = sliderValue === i;
          return (
            <span
              key={i}
              className={
                "whitespace-nowrap font-semibold transition-all " +
                (isEdge || isSelected
                  ? isSelected
                    ? "text-primary scale-110"
                    : ""
                  : "opacity-0 select-none")
              }
              style={{
                minWidth: 40,
                textAlign: "center",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {(isEdge || isSelected) && formatPrice(v)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default RangeFilter;
