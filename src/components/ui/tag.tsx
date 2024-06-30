export default function Tag({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 bg-zinc-100 text-zinc-900 rounded-full text-xs">
      {text}
    </span>
  );
}
