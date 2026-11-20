import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell not-found">
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>That note isn&apos;t in the library.</h1>
      <p>It may have moved, or the link may be incorrect.</p>
      <Link className="button-link" href="/">Back to the study desk</Link>
    </main>
  );
}
