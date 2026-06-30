import { useGame } from '../store/useGame'

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <label className="setting-row">
      <span className="setting-name">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="setting-val">{value.toFixed(2)}×</span>
    </label>
  )
}

export default function Settings() {
  const settings = useGame((s) => s.settings)
  const setSettings = useGame((s) => s.setSettings)
  return (
    <div className="settings-card">
      <h2>Settings</h2>
      <Slider
        label="Mouse look sensitivity"
        value={settings.mouseSensitivity}
        min={0.3}
        max={2.5}
        step={0.05}
        onChange={(v) => setSettings({ mouseSensitivity: v })}
      />
      <Slider
        label="Car steering sensitivity"
        value={settings.steerSensitivity}
        min={0.4}
        max={1.6}
        step={0.05}
        onChange={(v) => setSettings({ steerSensitivity: v })}
      />
      <label className="setting-row checkbox">
        <span className="setting-name">Invert mouse Y</span>
        <input
          type="checkbox"
          checked={settings.invertY}
          onChange={(e) => setSettings({ invertY: e.target.checked })}
        />
      </label>
      <p className="settings-hint">
        Lower = smoother, calmer aiming &amp; turning. Saved automatically.
      </p>
    </div>
  )
}
