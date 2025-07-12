export default function Loader({ color = "border-amber-50" }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={`w-6 h-6 border-4  border-t-transparent rounded-full animate-spin  ${color}`}
      />
    </div>
  );
}
