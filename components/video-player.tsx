'use client'

import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, X } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  thumbnail: string
  title: string
}

interface Settings {
  enableRedirects: boolean
  redirectUrl: string
  redirectClicks: number
}

export function VideoPlayer({ url, thumbnail, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  const playerRef = useRef<ReactPlayer>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Fetch settings on mount
  useEffect(() => {
    setMounted(true)
    fetchSettings()
  }, [])

  // Load click count from sessionStorage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('videoClickCount')
      if (stored) {
        setClickCount(parseInt(stored, 10))
      }
    }
  }, [mounted])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/public')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Set default settings on error
      setSettings({
        enableRedirects: false,
        redirectUrl: '',
        redirectClicks: 3
      })
    }
  }

  const handlePlayPause = () => {
    // If settings haven't loaded yet or redirects are disabled, just play/pause
    if (!mounted || !settings || !settings.enableRedirects) {
      setPlaying(!playing)
      return
    }

    // Check if redirects are enabled and we haven't reached the limit
    if (settings.enableRedirects && clickCount < settings.redirectClicks && settings.redirectUrl) {
      // Increment click count
      const newCount = clickCount + 1
      setClickCount(newCount)
      sessionStorage.setItem('videoClickCount', newCount.toString())
      
      // Open redirect URL in new tab
      window.open(settings.redirectUrl, '_blank')
      
      // Don't play the video yet
      return
    }

    // Play/pause the video
    setPlaying(!playing)
  }

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played)
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    setPlayed(newValue)
    playerRef.current?.seekTo(newValue)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setMuted(!muted)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false)
    }, 3000)
  }

  // Handle media.cm URLs
  const isMediaCm = url.includes('media.cm/')
  
  if (isMediaCm) {
    // Extract video ID
    const videoId = url.split('media.cm/').pop()?.split('?')[0].split('#')[0].replace('e/', '')
    const embedUrl = `https://media.cm/e/${videoId}`
    const mediaUrl = `https://media.cm/${videoId}`
    const thumbnailUrl = thumbnail || `https://i.media.cm/${videoId}_t.jpg`
    
    // Check if localhost (media.cm blocks localhost embeds)
    const isLocalhost = mounted && typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    
    if (isLocalhost) {
      // For localhost, show thumbnail and open in popup
      return (
        <div 
          ref={containerRef}
          className="relative bg-black rounded-lg overflow-hidden aspect-video cursor-pointer group"
          onClick={() => {
            const width = 1000
            const height = 600
            const left = (window.screen.width - width) / 2
            const top = (window.screen.height - height) / 2
            window.open(mediaUrl, 'MediaCM', `width=${width},height=${height},left=${left},top=${top}`)
          }}
        >
          <img 
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-jil-orange hover:bg-jil-orange/90 transition-all transform group-hover:scale-110">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute top-4 left-4 bg-yellow-500/90 text-black px-3 py-1 rounded text-xs font-semibold">
            DEV MODE: Click to open (embeds blocked on localhost)
          </div>
        </div>
      )
    }
    
    // For production, use iframe embed
    return (
      <div 
        ref={containerRef}
        className="relative bg-black rounded-lg overflow-hidden"
        style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}
      >
        <iframe 
          src={embedUrl}
          frameBorder="0" 
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>
    )
  }
  
  // For other embed URLs, use iframe
  const isEmbedUrl = url.includes('/e/') || url.includes('embed')
  
  if (isEmbedUrl) {
    return (
      <div 
        ref={containerRef}
        className="relative bg-black rounded-lg overflow-hidden aspect-video"
        style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}
      >
        <iframe
          src={url}
          frameBorder="0"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden aspect-video group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        muted={muted}
        volume={volume}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={handleDuration}
        onError={(e) => console.error('Video player error:', e)}
        onReady={() => console.log('Video ready to play')}
        controls={false}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              crossOrigin: 'anonymous'
            }
          }
        }}
      />

      {/* Play button overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          playing ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <button
          onClick={handlePlayPause}
          className="w-20 h-20 flex items-center justify-center rounded-full bg-jil-orange hover:bg-jil-orange/90 transition-all transform hover:scale-110"
        >
          <Play className="w-10 h-10 text-white ml-1" fill="white" />
        </button>
      </div>

      {/* Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={played}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-4
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-jil-orange"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-jil-orange transition"
            >
              {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-jil-orange transition"
              >
                {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-2
                  [&::-webkit-slider-thumb]:h-2
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm">
              {formatTime(played * duration)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-jil-orange transition"
          >
            {fullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  )
}
