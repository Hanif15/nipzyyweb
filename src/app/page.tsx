import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function HomePage() {
  // Redirect root domain langsung ke /blog
  redirect("/blog");
}
