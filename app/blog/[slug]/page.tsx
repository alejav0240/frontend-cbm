import { PublicBlogArticlePage } from "@/views/blog";

export default async function PaginaArticuloBlog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicBlogArticlePage slug={decodeURIComponent(slug)} />;
}
