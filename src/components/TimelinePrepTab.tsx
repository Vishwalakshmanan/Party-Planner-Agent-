import React, { useState } from 'react';
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  ShoppingBag,
  ChefHat,
  Palette,
  PartyPopper,
  Info,
} from 'lucide-react';
import { PartyPlan, PartyScheduleTask } from '../types';

interface TimelinePrepTabProps {
  timeline: PartyScheduleTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<PartyScheduleTask, 'id' | 'completed'>) => void;
}

export const TimelinePrepTab: React.FC<TimelinePrepTabProps> = ({
  timeline,
  onToggleTask,
  onAddTask,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [newTimeframe, setNewTimeframe] = useState<PartyScheduleTask['timeframe']>('1_day_before');
  const [newCategory, setNewCategory] = useState<PartyScheduleTask['category']>('prep');

  const completedCount = timeline.filter((t) => t.completed).length;
  const totalCount = timeline.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const timeframeLabels: Record<
    PartyScheduleTask['timeframe'],
    { label: string; sub: string; icon: string }
  > = {
    '3_days_before': { label: '3 Days Before', sub: 'Non-Perishables & Logistics', icon: '01' },
    '1_day_before': { label: '1 Day Before', sub: 'Fresh Meats & Make-Ahead Prep', icon: '02' },
    morning_of: { label: 'Morning of Event', sub: 'Ice Run & Table Setup', icon: '03' },
    '2_hours_before': { label: '2 Hours Before', sub: 'Chilling, Ambiance & Canapés', icon: '04' },
    during_party: { label: 'During Party', sub: 'Hosting, Warmers & Service', icon: '05' },
  };

  const categoryBadges: Record<
    PartyScheduleTask['category'],
    { label: string; color: string; icon: React.ReactNode }
  > = {
    shopping: {
      label: 'Procurement',
      color: 'bg-black text-[#FAF9F6] border-black',
      icon: <ShoppingBag className="w-2.5 h-2.5 text-[#C5A059]" />,
    },
    prep: {
      label: 'Culinary Prep',
      color: 'bg-[#FAF9F6] text-black border-black/30',
      icon: <ChefHat className="w-2.5 h-2.5 text-[#C5A059]" />,
    },
    decor: {
      label: 'Scenography',
      color: 'bg-[#C5A059]/15 text-[#8C6D2B] border-[#C5A059]/40',
      icon: <Palette className="w-2.5 h-2.5" />,
    },
    hosting: {
      label: 'Hospitality',
      color: 'bg-black/5 text-black border-black/20',
      icon: <PartyPopper className="w-2.5 h-2.5" />,
    },
  };

  // Group tasks by timeframe
  const timeframes: PartyScheduleTask['timeframe'][] = [
    '3_days_before',
    '1_day_before',
    'morning_of',
    '2_hours_before',
    'during_party',
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    onAddTask({
      task: newTaskText.trim(),
      timeframe: newTimeframe,
      category: newCategory,
    });

    setNewTaskText('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Progress */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Operational Timeline</span>
          </div>
          <h2 className="text-3xl font-light font-serif tracking-tight text-[#1a1a1a]">
            Culinary Prep & <span className="italic font-normal text-[#C5A059]">Run of Show</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md font-serif italic">
            A sequenced chronological roadmap ensuring effortless hosting without last-minute friction.
          </p>
        </div>

        {/* Progress Circular Gauge */}
        <div className="bg-[#1a1a1a] text-[#FAF9F6] border border-black p-4 min-w-[200px] text-right sm:text-center">
          <div className="text-2xl font-serif italic font-bold text-white">
            {completedCount} / {totalCount}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
            Completed ({progressPercent}%)
          </div>
          <div className="w-full bg-white/20 h-1 mt-2 overflow-hidden">
            <div
              className="bg-[#C5A059] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Task Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#C5A059] hover:text-black text-[#FAF9F6] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors border border-black"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancel' : 'Add Prep Milestone'}</span>
        </button>
      </div>

      {/* Add Task Modal / Card */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="bg-white border-2 border-black p-5 space-y-4 animate-in fade-in"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black">New Prep Task Directive</h3>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">Task Directive</label>
            <input
              type="text"
              required
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="e.g. Set up cocktail station, polish stemware, and queue jazz playlist"
              className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black font-serif italic"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">Timeframe</label>
              <select
                value={newTimeframe}
                onChange={(e) => setNewTimeframe(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold bg-[#FAF9F6] border border-black/20"
              >
                {timeframes.map((tf) => (
                  <option key={tf} value={tf}>
                    {timeframeLabels[tf].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">Discipline</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold bg-[#FAF9F6] border border-black/20"
              >
                <option value="shopping">Procurement</option>
                <option value="prep">Culinary Prep</option>
                <option value="decor">Scenography</option>
                <option value="hosting">Hospitality</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-[10px] uppercase font-bold text-black/60 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FAF9F6] bg-black hover:bg-[#C5A059] hover:text-black transition-colors"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Timeline Stream */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-black/15 before:hidden sm:before:block">
        {timeframes.map((tf) => {
          const tasksInFrame = timeline.filter((t) => t.timeframe === tf);
          if (tasksInFrame.length === 0) return null;

          const meta = timeframeLabels[tf];

          return (
            <div key={tf} className="relative sm:pl-12 space-y-3">
              {/* Header Icon / Dot */}
              <div className="hidden sm:flex absolute left-0 top-1.5 w-10 h-10 bg-black text-[#C5A059] items-center justify-center font-mono font-bold text-xs ring-4 ring-[#FAF9F6] border border-black">
                {meta.icon}
              </div>

              {/* Timeframe Title */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="sm:hidden font-mono text-xs font-bold text-[#C5A059] bg-black px-1.5 py-0.5">{meta.icon}</span>
                  <h3 className="text-lg font-serif font-bold text-[#1a1a1a] tracking-tight">
                    {meta.label}
                  </h3>
                </div>
                <p className="text-xs font-serif italic text-stone-500">{meta.sub}</p>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {tasksInFrame.map((task) => {
                  const badge = categoryBadges[task.category] || categoryBadges['prep'];

                  return (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className={`cursor-pointer p-4 border transition-all flex items-start space-x-3.5 select-none ${
                        task.completed
                          ? 'bg-[#FAF9F6]/60 border-black/10 opacity-50'
                          : 'bg-white border-black/15 hover:border-black shadow-xs'
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`mt-0.5 w-5 h-5 flex items-center justify-center border transition-colors shrink-0 ${
                          task.completed
                            ? 'bg-[#C5A059] border-[#C5A059] text-black font-bold'
                            : 'border-black/30 bg-white hover:border-black'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Task Text & Badge */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border inline-flex items-center gap-1 ${badge.color}`}
                          >
                            {badge.icon}
                            {badge.label}
                          </span>
                        </div>

                        <p
                          className={`text-sm font-serif font-bold text-[#1a1a1a] mt-1.5 ${
                            task.completed ? 'line-through text-black/40' : ''
                          }`}
                        >
                          {task.task}
                        </p>

                        {task.tips && (
                          <div className="mt-2 flex items-center space-x-1.5 text-xs font-serif italic text-stone-600 bg-[#FAF9F6] px-2.5 py-1.5 border border-black/10">
                            <Info className="w-3 h-3 text-[#C5A059] shrink-0" />
                            <span>{task.tips}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

