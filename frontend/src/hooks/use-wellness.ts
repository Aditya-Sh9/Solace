'use client'

// State for the Wellness page: the cycle overview (settings, today, phase map, today's log) plus
// the actions on it. The gentle log saves itself shortly after the last tap; a failed save puts
// the chips back the way the server has them, so what's on screen is never quietly unsaved.

import { useCallback, useEffect, useRef, useState } from 'react'
import { getCycle, saveCycleSettings, markPeriodStarted, stopCycleTracking, saveSymptomLog } from '@/src/lib/api/wellness'
import type { CycleOverview, CycleSettings, SymptomLog } from '@/src/types/wellness'

export type WellnessStatus = 'loading' | 'error' | 'ready'
export type LogSaveState = 'idle' | 'saving' | 'saved' | 'error'

const LOG_DEBOUNCE_MS = 700

export function useWellness() {
  const hasFetched = useRef(false)
  const [status,   setStatus]   = useState<WellnessStatus>('loading')
  const [overview, setOverview] = useState<CycleOverview | null>(null)
  const [log,      setLog]      = useState<SymptomLog>({ symptoms: [], intensity: null })
  const [logState, setLogState] = useState<LogSaveState>('idle')

  const savedLog = useRef<SymptomLog>({ symptoms: [], intensity: null })
  const timer    = useRef<number | null>(null)
  const pending  = useRef<SymptomLog | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    const { data, error } = await getCycle()
    if (error || !data) {
      console.error('[wellness] load failed:', error)
      setStatus('error')
      return
    }
    setOverview(data)
    setLog(data.log)
    savedLog.current = data.log
    setStatus('ready')
  }, [])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    load()
  }, [load])

  // Settings changes re-read the overview so the wheel, phase and log all agree with the server.
  const refresh = useCallback(async () => {
    const { data } = await getCycle()
    if (data) setOverview(data)
  }, [])

  const saveSettings = useCallback(async (settings: CycleSettings) => {
    const { error } = await saveCycleSettings(settings)
    if (!error) await refresh()
    return error
  }, [refresh])

  const periodStarted = useCallback(async () => {
    const { error } = await markPeriodStarted()
    if (!error) await refresh()
    return error
  }, [refresh])

  const stopTracking = useCallback(async () => {
    const { error } = await stopCycleTracking()
    if (!error) await refresh()
    return error
  }, [refresh])

  const persistLog = useCallback(async (next: SymptomLog) => {
    pending.current = null
    setLogState('saving')
    const { data, error } = await saveSymptomLog(next)
    if (error || !data) {
      console.error('[wellness] log save failed:', error)
      setLog(savedLog.current)
      setLogState('error')
      return
    }
    savedLog.current = data
    setLogState('saved')
  }, [])

  const updateLog = useCallback((next: SymptomLog) => {
    // Nothing logged means nothing to grade.
    const clean: SymptomLog = { symptoms: next.symptoms, intensity: next.symptoms.length ? next.intensity : null }
    setLog(clean)
    setLogState('saving')
    pending.current = clean
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => persistLog(clean), LOG_DEBOUNCE_MS)
  }, [persistLog])

  // Leaving the page mid-debounce still saves the last taps.
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
    if (pending.current) void saveSymptomLog(pending.current)
  }, [])

  return { status, overview, log, logState, retry: load, saveSettings, periodStarted, stopTracking, updateLog }
}
