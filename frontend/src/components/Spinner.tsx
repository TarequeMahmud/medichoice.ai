export default function Loader({
  color = "border-amber-50",
  size = "w-6 h-6",
}) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={`border-4  border-t-transparent rounded-full animate-spin ${color} ${size}`}
      />
    </div>
  );
}
