import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import Table from '../components/common/Table.jsx'
import { reefService } from '../services/reefService.js'

const emptyForm = { reef_name: '', country: '', latitude: '', longitude: '', coral_health: '', sea_temperature: '', bleaching_alert: false, protected_area: false, ghost_net_distance: '' }
const numericFields = new Set(['latitude', 'longitude', 'coral_health', 'sea_temperature'])
const messageFor = (error) => error.response?.data?.detail ?? 'Unable to complete the reef request.'

function ReefForm({ initialValues, onSubmit, submitting, title }) {
  const [values, setValues] = useState(initialValues)
  useEffect(() => setValues(initialValues), [initialValues])
  const update = (event) => {
    const { name, value, checked, type } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }
  const submit = (event) => {
    event.preventDefault()
    const payload = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, numericFields.has(key) ? Number(value) : value]))
    payload.ghost_net_distance = values.ghost_net_distance === '' ? null : Number(values.ghost_net_distance)
    onSubmit(payload)
  }
  return <Card title={title}><form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
    {['reef_name', 'country', 'latitude', 'longitude', 'coral_health', 'sea_temperature', 'ghost_net_distance'].map((field) => <label className="block text-sm font-medium" key={field}>{field.replaceAll('_', ' ')}<input required={field !== 'ghost_net_distance'} name={field} value={values[field]} type={field === 'reef_name' || field === 'country' ? 'text' : 'number'} step="any" onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>)}
    <label className="flex items-center gap-2 text-sm font-medium"><input name="bleaching_alert" type="checkbox" checked={values.bleaching_alert} onChange={update} />Bleaching alert</label>
    <label className="flex items-center gap-2 text-sm font-medium"><input name="protected_area" type="checkbox" checked={values.protected_area} onChange={update} />Protected area</label>
    <div className="md:col-span-2"><Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save reef'}</Button></div>
  </form></Card>
}

export default function ReefDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reefs, setReefs] = useState([])
  const [reef, setReef] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      if (id) setReef((await reefService.getById(id)).data)
      else setReefs((await reefService.getAll()).data)
    } catch (error) { toast.error(messageFor(error)) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [id])

  const save = async (payload) => {
    setSubmitting(true)
    try {
      const response = id ? await reefService.update(id, payload) : await reefService.create(payload)
      toast.success(id ? 'Reef updated.' : 'Reef created.')
      if (id) { setReef(response.data); setEditing(false) } else navigate(`/reef/${response.data.id}`)
    } catch (error) { toast.error(messageFor(error)) } finally { setSubmitting(false) }
  }
  const remove = async () => {
    if (!window.confirm(`Delete ${reef.reef_name}?`)) return
    try { await reefService.remove(reef.id); toast.success('Reef deleted.'); navigate('/reefs') } catch (error) { toast.error(messageFor(error)) }
  }

  if (loading) return <LoadingSpinner label="Loading reef data" />
  if (!id) return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Reef Intelligence</h1><p className="mt-1 text-slate-600">Manage reef records.</p></div><ReefForm initialValues={emptyForm} onSubmit={save} submitting={submitting} title="Create reef" /><Card title="Reefs">{reefs.length === 0 ? <EmptyState title="No reefs yet" description="Create the first reef record above." /> : <Table columns={['Reef', 'Country', 'Health', 'Actions']}>{reefs.map((item) => <tr className="border-t border-slate-200" key={item.id}><td className="px-4 py-3 font-medium">{item.reef_name}</td><td className="px-4 py-3">{item.country}</td><td className="px-4 py-3">{item.coral_health}%</td><td className="px-4 py-3"><Link className="text-ocean-700 underline" to={`/reef/${item.id}`}>View</Link></td></tr>)}</Table>}</Card></div>
  if (!reef) return <EmptyState title="Reef not found" description="The requested reef may have been deleted." />
  const formValues = { reef_name: reef.reef_name, country: reef.country, latitude: String(reef.latitude), longitude: String(reef.longitude), coral_health: String(reef.coral_health), sea_temperature: String(reef.sea_temperature), bleaching_alert: reef.bleaching_alert, protected_area: reef.protected_area, ghost_net_distance: reef.ghost_net_distance ?? '' }
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><Link className="text-sm text-ocean-700 underline" to="/reefs">Back to reefs</Link><h1 className="mt-2 text-2xl font-bold">{reef.reef_name}</h1></div><div className="flex gap-2"><Button variant="secondary" onClick={() => setEditing((value) => !value)}>{editing ? 'Cancel' : 'Edit'}</Button><Button variant="danger" onClick={remove}>Delete</Button></div></div>{editing ? <ReefForm initialValues={formValues} onSubmit={save} submitting={submitting} title="Edit reef" /> : <Card title="Reef information"><dl className="grid gap-4 sm:grid-cols-2">{[['Country', reef.country], ['Coordinates', `${reef.latitude}, ${reef.longitude}`], ['Coral health', `${reef.coral_health}%`], ['Sea temperature', `${reef.sea_temperature}°C`], ['Bleaching alert', reef.bleaching_alert ? 'Yes' : 'No'], ['Protected area', reef.protected_area ? 'Yes' : 'No'], ['Ghost net distance', reef.ghost_net_distance ?? 'Not recorded']].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl></Card>}</div>
}
