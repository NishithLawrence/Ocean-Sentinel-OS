import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import Table from '../components/common/Table.jsx'
import { reportService } from '../services/reportService.js'

const messageFor = (error) => typeof error.response?.data?.detail === 'string' ? error.response.data.detail : 'Unable to complete the report request.'

export default function Reports() {
  const [reports, setReports] = useState([])
  const [missionId, setMissionId] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)

  const loadReports = async () => {
    setLoading(true)
    try { setReports((await reportService.getAll()).data) } catch (error) { toast.error(messageFor(error)) } finally { setLoading(false) }
  }
  useEffect(() => { loadReports() }, [])

  const generate = async (event) => {
    event.preventDefault()
    setGenerating(true)
    try {
      await reportService.generate({ mission_id: Number(missionId) })
      setMissionId('')
      await loadReports()
      toast.success('Report generated.')
    } catch (error) { toast.error(messageFor(error)) } finally { setGenerating(false) }
  }
  const download = async (report) => {
    setDownloadingId(report.id)
    try {
      const response = await reportService.download(report.id)
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `ocean-sentinel-report-${report.id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) { toast.error(messageFor(error)) } finally { setDownloadingId(null) }
  }
  const remove = async (report) => {
    if (!window.confirm(`Delete the report for ${report.mission_title}?`)) return
    try { await reportService.remove(report.id); await loadReports(); toast.success('Report deleted.') } catch (error) { toast.error(messageFor(error)) }
  }

  if (loading) return <LoadingSpinner label="Loading reports" />
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Reports</h1><p className="mt-1 text-slate-600">Generate and download mission operations reports.</p></div><Card title="Generate report"><form className="flex flex-wrap items-end gap-3" onSubmit={generate}><label className="block text-sm font-medium">Mission ID<input required min="1" type="number" value={missionId} onChange={(event) => setMissionId(event.target.value)} className="mt-1 block rounded-md border border-slate-300 p-2" /></label><Button type="submit" disabled={generating}>{generating ? 'Generating…' : 'Generate PDF'}</Button></form></Card><Card title="Generated reports">{reports.length === 0 ? <EmptyState title="No reports yet" description="Generate a mission report using its mission ID." /> : <Table columns={['Report', 'Mission', 'Generated', 'Actions']}>{reports.map((report) => <tr className="border-t border-slate-200" key={report.id}><td className="px-4 py-3 font-medium">Report #{report.id}</td><td className="px-4 py-3">{report.mission_title}</td><td className="px-4 py-3">{new Date(report.generated_at).toLocaleDateString()}</td><td className="flex gap-2 px-4 py-3"><Button variant="secondary" className="px-2 py-1" onClick={() => download(report)} disabled={downloadingId === report.id}>{downloadingId === report.id ? 'Downloading…' : 'Download'}</Button><Button variant="danger" className="px-2 py-1" onClick={() => remove(report)}>Delete</Button></td></tr>)}</Table>}</Card></div>
}
