import { createFileRoute } from "@tanstack/react-router";
import { SongSearch } from "@/components/songs/SongSearch";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Find a Song · DIPRAP" }] }),
  component: SongSearch,
});
