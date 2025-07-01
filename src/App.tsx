import React, { useState } from 'react';
import { Plus, Timer, BarChart3 } from 'lucide-react';
import { useTimeTracker } from './hooks/useTimeTracker';
import { ProjectCard } from './components/ProjectCard';
import { AddProjectModal } from './components/AddProjectModal';
import { DailyReport } from './components/DailyReport';
import { getTodayString } from './utils/timeUtils';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    projects,
    activeTimer,
    addProject,
    removeProject,
    startTimer,
    stopTimer,
    getDailyReport,
    getProjectDuration
  } = useTimeTracker();

  const dailyReport = getDailyReport(getTodayString());

  const handleAddProject = (name: string, color: string, description?: string) => {
    addProject(name, color, description);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo progetto? Tutti i dati di tracciamento associati verranno persi.')) {
      removeProject(projectId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 text-white rounded-xl">
                <Timer size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TimeTracker Pro</h1>
                <p className="text-gray-500">Gestisci il tempo sui tuoi progetti</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              <span>Nuovo Progetto</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 size={24} className="text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">I Tuoi Progetti</h2>
              {projects.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  {projects.length}
                </span>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="p-4 bg-gray-100 text-gray-400 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Timer size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun progetto ancora</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Inizia creando il tuo primo progetto per tracciare il tempo dedicato alle tue attività.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus size={20} />
                  <span>Crea il primo progetto</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isActive={activeTimer?.projectId === project.id}
                    duration={getProjectDuration(project.id)}
                    onStart={() => startTimer(project.id)}
                    onStop={stopTimer}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Daily Report Section */}
          <div className="lg:col-span-1">
            <DailyReport report={dailyReport} />
          </div>
        </div>
      </main>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProject}
      />
    </div>
  );
}

export default App;