import EstimateForm from "@/components/EstimateForm";

export default function EstimatePage() {
  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden" style={{ maxHeight: "92vh" }}>
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <EstimateForm />
        </div>
      </div>
    </div>
  );
}
