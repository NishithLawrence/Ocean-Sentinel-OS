import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import Table from '../components/common/Table.jsx'
import { missionService } from '../services/missionService.js'

const emptyForm = { title: '', description: '', reef_id: '', assigned_team: '', priority: 'MEDIUM', status: 'PLANNED', scheduled_date: '', completed_date: '' }
const messageFor = (error) => typeof error.response?.data?.detail === 'string' ? error.response.data.detail : 'Unable to complete the mission request.'

function MissionForm({ initialValues, onSubmit, submitting, title, onCancel }) {
  const [values, setValues] = useState(initialValues)
  useEffect(() => setValues(initialValues), [initialValues])
  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    onSubmit({ ...values, reef_id: Number(values.reef_id), assigned_team: Number(values.assigned_team), completed_date: values.completed_date || null })
  }
  return <Card title={title}><form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
    <label className="md:col-span-2 text-sm font-medium">Title<input required name="title" value={values.title} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="md:col-span-2 text-sm font-medium">Description<textarea required name="description" value={values.description} onChange={update} className="mt-1 block min-h-24 w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="text-sm font-medium">Reef ID<input required min="1" type="number" name="reef_id" value={values.reef_id} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="text-sm font-medium">Assigned team ID<input required min="1" type="number" name="assigned_team" value={values.assigned_team} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="text-sm font-medium">Priority<select name="priority" value={values.priority} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2">{['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((item) => <option key={item}>{item}</option>)}</select></label>
    <label className="text-sm font-medium">Status<select name="status" value={values.status} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2">{['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((item) => <option key={item}>{item}</option>)}</select></label>
    <label className="text-sm font-medium">Scheduled date<input required type="date" name="scheduled_date" value={values.scheduled_date} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="text-sm font-medium">Completed date<input type="date" name="completed_date" value={values.completed_date} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <div className="flex gap-2 md:col-span-2"><Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save mission'}</Button><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button></div>
  </form></Card>
}

export default function MissionPlanner() {
  const [missions, setMissions] = useState([])
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('list')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadMissions = async () => {
    setLoading(true)
    try { setMissions((await missionService.getAll()).data) } catch (error) { toast.error(messageFor(error)) } finally { setLoading(false) }
  }
  useEffect(() => { loadMissions() }, [])

  const save = async (payload) => {
    setSubmitting(true)
    try {
      const response = mode === 'edit' ? await missionService.update(selected.id, payload) : await missionService.create(payload)
      setSelected(response.data)
      setMode('detail')
      await loadMissions()
      toast.success(mode === 'edit' ? 'Mission updated.' : 'Mission created.')
    } catch (error) { toast.error(messageFor(error)) } finally { setSubmitting(false) }
  }
  const remove = async () => {
    if (!window.confirm(`Delete ${selected.title}?`)) return
    try { await missionService.remove(selected.id); setSelected(null); setMode('list'); await loadMissions(); toast.success('Mission deleted.') } catch (error) { toast.error(messageFor(error)) }
  }

  if (loading) return <LoadingSpinner label="Loading missions" />
  const editValues = selected && { ...selected, reef_id: String(selected.reef_id), assigned_team: String(selected.assigned_team), completed_date: selected.completed_date || '' }
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Mission Planner</h1><p className="mt-1 text-slate-600">Create and manage conservation missions.</p></div>{mode === 'list' && <Button onClick={() => setMode('create')}>Create mission</Button>}</div>
    {mode === 'create' && <MissionForm initialValues={emptyForm} onSubmit={save} submitting={submitting} title="Create mission" onCancel={() => setMode('list')} />}
    {mode === 'edit' && <MissionForm initialValues={editValues} onSubmit={save} submitting={submitting} title="Edit mission" onCancel={() => setMode('detail')} />}
    {mode === 'detail' && selected && <Card title="Mission details"><dl className="grid gap-4 sm:grid-cols-2">{[['Title', selected.title], ['Description', selected.description], ['Reef ID', selected.reef_id], ['Assigned team', selected.assigned_team], ['Priority', selected.priority], ['Status', selected.status], ['Scheduled date', selected.scheduled_date], ['Completed date', selected.completed_date || 'Not completed']].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl><div className="mt-6 flex gap-2"><Button onClick={() => setMode('edit')}>Edit</Button><Button variant="danger" onClick={remove}>Delete</Button><Button variant="secondary" onClick={() => setMode('list')}>Back to list</Button></div></Card>}
    {mode === 'list' && <Card title="Missions">{missions.length === 0 ? <EmptyState title="No missions yet" description="Create the first mission to begin planning." /> : <Table columns={['Title', 'Priority', 'Status', 'Scheduled', 'Actions']}>{missions.map((mission) => <tr className="border-t border-slate-200" key={mission.id}><td className="px-4 py-3 font-medium">{mission.title}</td><td className="px-4 py-3">{mission.priority}</td><td className="px-4 py-3">{mission.status}</td><td className="px-4 py-3">{mission.scheduled_date}</td><td className="px-4 py-3"><Button variant="secondary" className="px-2 py-1" onClick={() => { setSelected(mission); setMode('detail') }}>View</Button></td></tr>)}</Table>}</Card>}
  </div>
}
