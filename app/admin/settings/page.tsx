'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Settings {
  id: string
  enableRedirects: boolean
  redirectUrl: string
  redirectClicks: number
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    id: '',
    enableRedirects: false,
    redirectUrl: '',
    redirectClicks: 3
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('Settings saved successfully!')
        router.refresh()
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading settings...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your site configuration</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Ad Redirect Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Configure advertisement redirect behavior on video player
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable Redirects Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <Label htmlFor="enableRedirects" className="text-white text-base">
                  Enable Ad Redirects
                </Label>
                <p className="text-sm text-gray-400 mt-1">
                  When enabled, the first few clicks on video play button will open redirect URL
                </p>
              </div>
              <button
                id="enableRedirects"
                onClick={() => setSettings({ ...settings, enableRedirects: !settings.enableRedirects })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableRedirects ? 'bg-jil-orange' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableRedirects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Redirect URL */}
            <div className="space-y-2">
              <Label htmlFor="redirectUrl" className="text-white">
                Redirect URL
              </Label>
              <Input
                id="redirectUrl"
                type="url"
                placeholder="https://example.com/ads"
                value={settings.redirectUrl}
                onChange={(e) => setSettings({ ...settings, redirectUrl: e.target.value })}
                disabled={!settings.enableRedirects}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-sm text-gray-400">
                The URL that will open in a new tab when users click the play button
              </p>
            </div>

            {/* Number of Clicks */}
            <div className="space-y-2">
              <Label htmlFor="redirectClicks" className="text-white">
                Number of Redirect Clicks
              </Label>
              <Input
                id="redirectClicks"
                type="number"
                min="1"
                max="10"
                value={settings.redirectClicks}
                onChange={(e) => setSettings({ ...settings, redirectClicks: parseInt(e.target.value) || 3 })}
                disabled={!settings.enableRedirects}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-sm text-gray-400">
                How many times the play button should redirect before actually playing the video (per session)
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-jil-orange hover:bg-jil-orange/90 text-white"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Info */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Current Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={settings.enableRedirects ? 'text-green-400' : 'text-red-400'}>
                  {settings.enableRedirects ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {settings.enableRedirects && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Redirect URL:</span>
                    <span className="text-white truncate ml-4 max-w-md">{settings.redirectUrl || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Number of Clicks:</span>
                    <span className="text-white">{settings.redirectClicks}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
