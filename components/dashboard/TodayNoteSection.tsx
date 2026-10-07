'use client';

import { useState, useTransition } from 'react';
import { BookOpen, Save } from 'lucide-react';
import { saveDailyNote } from '@/lib/actions';
import { cn } from '@/lib/utils';

interface Note {
  accomplishment: string | null;
  learning: string | null;
  difficulty: string | null;
  tomorrow: string | null;
  mood: string | null;
}

const MOODS = [
  { key: 'TERRIBLE', emoji: '😞', label: 'Terrible' },
  { key: 'BAD', emoji: '😐', label: 'Bad' },
  { key: 'OKAY', emoji: '🙂', label: 'Okay' },
  { key: 'GOOD', emoji: '😊', label: 'Good' },
  { key: 'GREAT', emoji: '🤩', label: 'Great' },
];

export function TodayNoteSection({
  note,
  todayStr,
}: {
  note: Note | null;
  todayStr: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    accomplishment: note?.accomplishment ?? '',
    learning: note?.learning ?? '',
    difficulty: note?.difficulty ?? '',
    tomorrow: note?.tomorrow ?? '',
    mood: note?.mood ?? '',
  });

  const handleSave = () => {
    startTransition(async () => {
      await saveDailyNote({ date: todayStr, ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-indigo-500" />
        <h2 className="section-title">Today&apos;s Reflection</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            What did I accomplish?
          </label>
          <textarea
            id="accomplishment-input"
            className="textarea"
            rows={3}
            placeholder="Completed Python chapter, solved 2 DSA problems..."
            value={form.accomplishment}
            onChange={(e) => setForm((p) => ({ ...p, accomplishment: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            What did I learn?
          </label>
          <textarea
            id="learning-input"
            className="textarea"
            rows={3}
            placeholder="Learned about hashmaps, understood binary search..."
            value={form.learning}
            onChange={(e) => setForm((p) => ({ ...p, learning: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            What was difficult?
          </label>
          <textarea
            id="difficulty-input"
            className="textarea"
            rows={2}
            placeholder="System design concepts, async FastAPI..."
            value={form.difficulty}
            onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Improve tomorrow
          </label>
          <textarea
            id="tomorrow-input"
            className="textarea"
            rows={2}
            placeholder="Start earlier, fewer distractions..."
            value={form.tomorrow}
            onChange={(e) => setForm((p) => ({ ...p, tomorrow: e.target.value }))}
          />
        </div>
      </div>

      {/* Mood */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          How was today?
        </label>
        <div className="flex items-center gap-2">
          {MOODS.map((m) => (
            <button
              key={m.key}
              id={`mood-${m.key.toLowerCase()}`}
              onClick={() =>
                setForm((p) => ({ ...p, mood: p.mood === m.key ? '' : m.key }))
              }
              className={cn(
                'text-2xl p-2 rounded-xl transition-all',
                form.mood === m.key
                  ? 'bg-indigo-100 scale-110 shadow-sm'
                  : 'hover:bg-slate-100',
              )}
              title={m.label}
              aria-label={m.label}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          id="save-note-btn"
          onClick={handleSave}
          disabled={isPending}
          className={cn('btn-primary', saved && 'bg-green-500')}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : isPending ? 'Saving…' : 'Save Note'}
        </button>
      </div>
    </div>
  );
}
