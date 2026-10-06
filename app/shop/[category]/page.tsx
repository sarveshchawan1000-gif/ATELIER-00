import { redirect } from 'next/navigation';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const lower = category.toLowerCase();
  if (['male', 'female', 'kids', 'men', 'women'].includes(lower)) {
    const g = lower === 'men' ? 'male' : lower === 'women' ? 'female' : lower;
    redirect(`/shop?gender=${encodeURIComponent(g)}`);
  }
  redirect(`/shop?category=${encodeURIComponent(category)}`);
}
