import { InsightDetailPage } from '@/src/components/insights'

interface Props {
  params: Promise<{ id: string }>
}

export default async function InsightDetailRoute({ params }: Props) {
  const { id } = await params
  return <InsightDetailPage id={id} />
}
