import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-heading text-navy text-3xl font-bold mb-4">Product Not Found</h1>
      <p className="font-body text-navy/60 mb-8">This product page doesn&apos;t exist or has been removed.</p>
      <Link href="/" className="font-body text-steel underline">
        Back to Home
      </Link>
    </div>
  );
}
