import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TestPage() {
  const voices = await prisma.voice.findMany();

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">
        Voices ({voices.length})
      </h1>

      <ul className="space-y-2">
        {voices.map((voice) => (
          <li key={voice.id}>
            {voice.name} - {voice.variant}
          </li>
        ))}
      </ul>
    </div>
  );
}