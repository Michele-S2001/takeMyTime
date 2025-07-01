import React from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { DailyReport as DailyReportType } from '../types';
import { formatDate } from '../utils/timeUtils';

interface DailyReportProps {
  report: DailyReportType;
}

export const DailyReport: React.FC<DailyReportProps> = ({ report }) => {
  const maxHours = Math.max(...report.projects.map(p => p.hours), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Report Giornaliero</h2>
            <p className="text-sm text-gray-500">{formatDate(report.date)}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <Clock size={24} className="text-blue-500" />
            <span>{report.totalHours.toFixed(1)}h</span>
          </div>
          <p className="text-sm text-gray-500">Totale oggi</p>
        </div>
      </div>

      {report.projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 text-gray-400 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <p className="text-gray-500">Nessuna attività registrata oggi</p>
          <p className="text-sm text-gray-400 mt-1">Inizia a tracciare il tempo sui tuoi progetti!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {report.projects.map((project) => (
            <div key={project.projectId} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="font-medium text-gray-900">{project.projectName}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">{project.hours.toFixed(1)}h</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({Math.round((project.hours / report.totalHours) * 100)}%)
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    backgroundColor: project.color,
                    width: `${(project.hours / maxHours) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};