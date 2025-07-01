import React from 'react';
import { Play, Pause, Trash2, Clock } from 'lucide-react';
import { Project } from '../types';
import { formatDuration, formatHours } from '../utils/timeUtils';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  duration: number;
  onStart: () => void;
  onStop: () => void;
  onDelete: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isActive,
  duration,
  onStart,
  onStop,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group overflow-hidden">
      <div 
        className="h-2"
        style={{ backgroundColor: project.color }}
      />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          
          <button
            onClick={onDelete}
            className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Elimina progetto"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-1" />
              {duration > 0 ? formatHours(duration) : '0m'}
            </div>
            
            {isActive && (
              <div className="flex items-center text-sm font-medium text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                {formatDuration(duration)}
              </div>
            )}
          </div>

          <button
            onClick={isActive ? onStop : onStart}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isActive ? (
              <>
                <Pause size={16} />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Start</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};