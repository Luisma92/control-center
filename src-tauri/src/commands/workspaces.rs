//! Workspaces: grupos con nombre para no mezclar todos los proyectos.
use crate::domain::Workspace;
use crate::AppState;

#[tauri::command(async)]
pub fn list_workspaces(state: tauri::State<'_, AppState>) -> Result<Vec<Workspace>, String> {
    state.with_storage(|db| db.list_workspaces())
}

#[tauri::command(async)]
pub fn create_workspace(name: String, state: tauri::State<'_, AppState>) -> Result<Workspace, String> {
    state.with_storage(|db| db.create_workspace(&name))
}

#[tauri::command(async)]
pub fn rename_workspace(workspace_id: String, name: String, state: tauri::State<'_, AppState>) -> Result<Workspace, String> {
    state.with_storage(|db| db.rename_workspace(&workspace_id, &name))
}

#[tauri::command(async)]
pub fn delete_workspace(workspace_id: String, state: tauri::State<'_, AppState>) -> Result<(), String> {
    state.with_storage(|db| db.delete_workspace(&workspace_id))
}

#[tauri::command(async)]
pub fn set_project_workspace(
    project_id: String,
    workspace_id: Option<String>,
    state: tauri::State<'_, AppState>,
) -> Result<Option<String>, String> {
    state.with_storage(|db| db.set_project_workspace(&project_id, workspace_id.as_deref()))
}
