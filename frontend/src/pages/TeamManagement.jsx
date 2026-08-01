import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import Table from '../components/common/Table.jsx'
import { teamService } from '../services/teamService.js'

const emptyForm = { team_name: '', leader_name: '', specialization: '', member_count: '', status: 'Available', contact_email: '', contact_phone: '' }
const statuses = ['Available', 'On Mission', 'Maintenance', 'Inactive']
const messageFor = (error) => typeof error.response?.data?.detail === 'string' ? error.response.data.detail : 'Unable to complete the team request.'

function TeamForm({ initialValues, onSubmit, submitting, title, onCancel }) {
  const [values, setValues] = useState(initialValues)
  useEffect(() => setValues(initialValues), [initialValues])
  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => { event.preventDefault(); onSubmit({ ...values, member_count: Number(values.member_count) }) }
  return <Card title={title}><form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
    <label className="text-sm font-medium">Team name<input required name="team_name" value={values.team_name} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="text-sm font-medium">Leader name<input required name="leader_name" value={values.leader_name} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="text-sm font-medium">Specialization<input required name="specialization" value={values.specialization} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="text-sm font-medium">Member count<input required min="0" type="number" name="member_count" value={values.member_count} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="text-sm font-medium">Status<select name="status" value={values.status} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2">{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label className="text-sm font-medium">Contact email<input required type="email" name="contact_email" value={values.contact_email} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <label className="text-sm font-medium">Contact phone<input required type="tel" name="contact_phone" value={values.contact_phone} onChange={update} className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>
    <div className="flex gap-2 md:col-span-2"><Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save team'}</Button><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button></div>
  </form></Card>
}

export default function TeamManagement() {
  const [teams, setTeams] = useState([])
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('list')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const loadTeams = async () => { setLoading(true); try { setTeams((await teamService.getAll()).data) } catch (error) { toast.error(messageFor(error)) } finally { setLoading(false) } }
  useEffect(() => { loadTeams() }, [])
  const save = async (payload) => {
    setSubmitting(true)
    try {
      const response = mode === 'edit' ? await teamService.update(selected.id, payload) : await teamService.create(payload)
      setSelected(response.data); setMode('detail'); await loadTeams(); toast.success(mode === 'edit' ? 'Team updated.' : 'Team created.')
    } catch (error) { toast.error(messageFor(error)) } finally { setSubmitting(false) }
  }
  const remove = async () => {
    if (!window.confirm(`Delete ${selected.team_name}?`)) return
    try { await teamService.remove(selected.id); setSelected(null); setMode('list'); await loadTeams(); toast.success('Team deleted.') } catch (error) { toast.error(messageFor(error)) }
  }
  if (loading) return <LoadingSpinner label="Loading teams" />
  const editValues = selected && { team_name: selected.team_name, leader_name: selected.leader_name, specialization: selected.specialization, member_count: String(selected.member_count), status: selected.status, contact_email: selected.contact_email, contact_phone: selected.contact_phone }
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Team Management</h1><p className="mt-1 text-slate-600">Manage marine conservation teams.</p></div>{mode === 'list' && <Button onClick={() => setMode('create')}>Create team</Button>}</div>
    {mode === 'create' && <TeamForm initialValues={emptyForm} onSubmit={save} submitting={submitting} title="Create team" onCancel={() => setMode('list')} />}
    {mode === 'edit' && <TeamForm initialValues={editValues} onSubmit={save} submitting={submitting} title="Edit team" onCancel={() => setMode('detail')} />}
    {mode === 'detail' && selected && <Card title="Team details"><dl className="grid gap-4 sm:grid-cols-2">{[['Team name', selected.team_name], ['Leader', selected.leader_name], ['Specialization', selected.specialization], ['Members', selected.member_count], ['Status', selected.status], ['Email', selected.contact_email], ['Phone', selected.contact_phone]].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl><div className="mt-6 flex gap-2"><Button onClick={() => setMode('edit')}>Edit</Button><Button variant="danger" onClick={remove}>Delete</Button><Button variant="secondary" onClick={() => setMode('list')}>Back to list</Button></div></Card>}
    {mode === 'list' && <Card title="Teams">{teams.length === 0 ? <EmptyState title="No teams yet" description="Create the first team to begin managing assignments." /> : <Table columns={['Team', 'Leader', 'Status', 'Members', 'Actions']}>{teams.map((team) => <tr className="border-t border-slate-200" key={team.id}><td className="px-4 py-3 font-medium">{team.team_name}</td><td className="px-4 py-3">{team.leader_name}</td><td className="px-4 py-3">{team.status}</td><td className="px-4 py-3">{team.member_count}</td><td className="px-4 py-3"><Button variant="secondary" className="px-2 py-1" onClick={() => { setSelected(team); setMode('detail') }}>View</Button></td></tr>)}</Table>}</Card>}
  </div>
}
