// app/pad/[id]/page.tsx
import ViewPad from '@/components/ViewPad';

export default async function PadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <main>
      <ViewPad padId={id} />
    </main>
  );
}
