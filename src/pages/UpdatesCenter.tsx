import { UpdatesCenter } from "@/components/updates-center";
import { HomeButton } from "@/components/home-button";

export default function UpdatesCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <HomeButton />
          <h1 className="text-3xl font-bold">Central de Atualizações</h1>
        </div>
        <UpdatesCenter />
      </div>
    </div>
  );
}