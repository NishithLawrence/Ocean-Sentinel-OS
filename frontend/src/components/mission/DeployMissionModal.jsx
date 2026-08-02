import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import { missionService } from '../../services/missionService.js'

export default function DeployMissionModal({
  isOpen,
  onClose,
  reef,
  recommendation,
  teams = [],
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reef_id: '',
    assigned_team: '',
    priority: 'HIGH',
    scheduled_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (reef && isOpen) {
      const op = recommendation?.operational_recommendation ?? recommendation ?? {}
      const defaultTitle = op.suggested_title ?? `Conservation Mission - ${reef.reef_name}`
      const defaultDesc = op.suggested_description ?? `AI-recommended mission for ${reef.reef_name}. Telemetry: Coral Health ${reef.coral_health}%, SST ${reef.sea_temperature}°C.`
      const defaultPriority = (op.priority ?? 'HIGH').toUpperCase()
      const defaultTeamId = op.suggested_team_id ?? (teams.length > 0 ? teams[0].id : 1)

      setFormData({
        title: defaultTitle,
        description: defaultDesc,
        reef_id: String(reef.id),
        assigned_team: String(defaultTeamId),
        priority: defaultPriority,
        scheduled_date: new Date().toISOString().split('T')[0],
      })
    }
  }, [reef, recommendation, teams, isOpen])

  if (!isOpen || !reef) return null

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        reef_id: Number(formData.reef_id),
        assigned_team: Number(formData.assigned_team),
        priority: formData.priority,
        status: 'PLANNED',
        scheduled_date: formData.scheduled_date,
      }
      await missionService.create(payload)

      toast.success('Mission Successfully Deployed')
      window.dispatchEvent(new CustomEvent('ocean-sentinel:mission-created'))

      if (onSuccess) onSuccess()
      onClose()
    } catch (error) {
      const detail = error.response?.data?.detail
      const msg = typeof detail === 'string' ? detail : 'Failed to deploy mission.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Deploy Conservation Mission" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Target Reef
          </label>
          <input
            type="text"
            disabled
            value={`${reef.reef_name} (${reef.country})`}
            className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-300 shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Mission Title (Prefilled)
          </label>
          <input
            type="text"
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-cyan-500/30 bg-slate-900/80 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Mission Description (Prefilled)
          </label>
          <textarea
            required
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-cyan-500/30 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Priority (Prefilled)
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-cyan-500/30 bg-slate-900/80 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Suggested Team (Prefilled)
            </label>
            <select
              name="assigned_team"
              value={formData.assigned_team}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-cyan-500/30 bg-slate-900/80 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.team_name} ({t.specialization})
                </option>
              ))}
              {teams.length === 0 && <option value="1">Team Alpha</option>}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
            Mission Date (Select Date)
          </label>
          <input
            type="date"
            required
            name="scheduled_date"
            value={formData.scheduled_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-cyan-400/60 bg-slate-900 px-3 py-2 text-sm text-cyan-100 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Deploying...' : 'Create Mission'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
