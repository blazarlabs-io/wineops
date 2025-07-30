import Anexa7Page from "@/components/pages/workspace/reports/anexa7/anexa7-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <Anexa7Page anexa7Id={id} />;
}
