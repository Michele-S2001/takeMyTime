import { useState, useEffect, useCallback } from 'react';
import { Project, TimeEntry, ActiveTimer, DailyReport } from '../types';
import { getTodayString } from '../utils/timeUtils';

const STORAGE_KEYS = {
  PROJECTS: 'timetracker_projects',
  TIME_ENTRIES: 'timetracker_entries',
  ACTIVE_TIMER: 'timetracker_active'
};

export const useTimeTracker = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const savedEntries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    const savedTimer = localStorage.getItem(STORAGE_KEYS.ACTIVE_TIMER);

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      })));
    }

    if (savedEntries) {
      setTimeEntries(JSON.parse(savedEntries).map((e: any) => ({
        ...e,
        startTime: new Date(e.startTime),
        endTime: e.endTime ? new Date(e.endTime) : undefined
      })));
    }

    if (savedTimer) {
      const timer = JSON.parse(savedTimer);
      setActiveTimer({
        ...timer,
        startTime: new Date(timer.startTime)
      });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    if (activeTimer) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMER, JSON.stringify(activeTimer));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMER);
    }
  }, [activeTimer]);

  // Update current time every second when there's an active timer
  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const addProject = useCallback((name: string, color: string, description?: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      color,
      description,
      createdAt: new Date()
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const removeProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTimeEntries(prev => prev.filter(e => e.projectId !== projectId));
    if (activeTimer?.projectId === projectId) {
      setActiveTimer(null);
    }
  }, [activeTimer]);

  const startTimer = useCallback((projectId: string) => {
    if (activeTimer) {
      stopTimer();
    }
    setActiveTimer({
      projectId,
      startTime: new Date()
    });
  }, [activeTimer]);

  const stopTimer = useCallback(() => {
    if (!activeTimer) return;

    const endTime = new Date();
    const duration = endTime.getTime() - activeTimer.startTime.getTime();

    const newEntry: TimeEntry = {
      id: crypto.randomUUID(),
      projectId: activeTimer.projectId,
      startTime: activeTimer.startTime,
      endTime,
      duration,
      date: getTodayString()
    };

    setTimeEntries(prev => [...prev, newEntry]);
    setActiveTimer(null);
  }, [activeTimer]);

  const getActiveTimerDuration = useCallback(() => {
    if (!activeTimer) return 0;
    return currentTime.getTime() - activeTimer.startTime.getTime();
  }, [activeTimer, currentTime]);

  const getDailyReport = useCallback((date: string = getTodayString()): DailyReport => {
    const dayEntries = timeEntries.filter(entry => entry.date === date);
    const projectStats = new Map<string, { duration: number; name: string; color: string }>();

    dayEntries.forEach(entry => {
      const project = projects.find(p => p.id === entry.projectId);
      if (!project) return;

      const existing = projectStats.get(entry.projectId) || { duration: 0, name: project.name, color: project.color };
      existing.duration += entry.duration;
      projectStats.set(entry.projectId, existing);
    });

    // Add active timer duration if it's for today
    if (activeTimer && date === getTodayString()) {
      const project = projects.find(p => p.id === activeTimer.projectId);
      if (project) {
        const existing = projectStats.get(activeTimer.projectId) || { duration: 0, name: project.name, color: project.color };
        existing.duration += getActiveTimerDuration();
        projectStats.set(activeTimer.projectId, existing);
      }
    }

    const projectsData = Array.from(projectStats.entries()).map(([projectId, stats]) => ({
      projectId,
      projectName: stats.name,
      hours: stats.duration / (1000 * 60 * 60),
      color: stats.color
    }));

    const totalHours = projectsData.reduce((sum, p) => sum + p.hours, 0);

    return {
      date,
      totalHours,
      projects: projectsData.sort((a, b) => b.hours - a.hours)
    };
  }, [timeEntries, projects, activeTimer, getActiveTimerDuration]);

  const getProjectDuration = useCallback((projectId: string, date: string = getTodayString()) => {
    const dayEntries = timeEntries.filter(entry => 
      entry.projectId === projectId && entry.date === date
    );
    
    let duration = dayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    
    // Add active timer duration if it matches
    if (activeTimer?.projectId === projectId && date === getTodayString()) {
      duration += getActiveTimerDuration();
    }
    
    return duration;
  }, [timeEntries, activeTimer, getActiveTimerDuration]);

  return {
    projects,
    timeEntries,
    activeTimer,
    addProject,
    removeProject,
    startTimer,
    stopTimer,
    getActiveTimerDuration,
    getDailyReport,
    getProjectDuration
  };
};