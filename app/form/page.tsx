import DataEntryApp from "@/components/form/data-entry-app";
import "./styles.css";
import LayoutClient from "../LayoutClient";

export default function Home() {
  return (
    <div>
      <LayoutClient children={undefined}></LayoutClient>
      <main className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Aplicación de Ingreso de Datos
          </h1>
          <DataEntryApp />
        </div>
      </main>
    </div>
  );
}
