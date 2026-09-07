import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import type { Workspace } from '../types'
import { reportError, type NoticeKind } from './useNotices'

export function useWorkspaces(notify: (text: string, kind?: NoticeKind) => void) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  const loadWorkspaces = useCallback(async () => {
    try {
      setWorkspaces(await api.listWorkspaces())
    } catch (error) {
      reportError(error)
    }
  }, [])

  useEffect(() => {
    void loadWorkspaces()
  }, [loadWorkspaces])

  const createWorkspace = useCallback(
    async (name: string) => {
      const workspace = await api.createWorkspace(name)
      setWorkspaces(current => [...current, workspace].sort((a, b) => a.name.localeCompare(b.name)))
      notify(`Workspace «${workspace.name}» creado.`)
      return workspace
    },
    [notify]
  )

  const renameWorkspace = useCallback(
    async (workspaceId: string, name: string) => {
      const workspace = await api.renameWorkspace(workspaceId, name)
      setWorkspaces(current => current.map(item => (item.id === workspaceId ? workspace : item)))
      notify(`Workspace renombrado a «${workspace.name}».`)
      return workspace
    },
    [notify]
  )

  const deleteWorkspace = useCallback(
    async (workspaceId: string, name: string) => {
      await api.deleteWorkspace(workspaceId)
      setWorkspaces(current => current.filter(item => item.id !== workspaceId))
      notify(`Workspace «${name}» eliminado. Los proyectos quedan sin asignar.`)
    },
    [notify]
  )

  return { workspaces, loadWorkspaces, createWorkspace, renameWorkspace, deleteWorkspace }
}
