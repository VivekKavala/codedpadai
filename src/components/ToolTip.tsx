import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ToolTip() {
  return (
    <Link
      href="/create"
      className="fixed bottom-4 right-4 p-4 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500"
    >
      <Plus className="w-5 h-5 stroke-white" />
    </Link>
  );
}
