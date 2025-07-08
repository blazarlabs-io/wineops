import Anexa14Page from "@/components/pages/workspace/reports/anexa14/anexa14-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <Anexa14Page anexa14Id={id} />;
}
