'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { BookOpen, Search } from 'lucide-react';
import { cn, getMoodEmoji } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

interface Note {
  id: string;
  date: Date;
  accomplishment: string | null;
  learning: string | null;
  difficulty: string | null;
  tomorrow: string | null;
  mood: string | null;
}

export function NotesClient({ notes }: { notes: Note[] }) {
  const [search, setSearch] = useState('');

  const filtered = notes.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.accomplishment?.toLowerCase().includes(q) ||
      n.learning?.toLowerCase().includes(q) ||
      n.difficulty?.toLowerCase().includes(q) ||
      n.tomorrow?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id="notes-search"
          type="text"
          className="input pl-10"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📓"
          title="No notes yet"
          description="Write your daily reflection from the Today page. It'll appear here."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const [expanded, setExpanded] = useState(false);

  const preview = note.accomplishment || note.learning || note.difficulty || '(no content)';

  return (
    <div className="card p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-sm font-semibold text-slate-800">
              {format(new Date(note.date), 'EEEE, MMMM d, yyyy')}
            </p>
            {note.mood && (
              <span className="text-lg">{getMoodEmoji(note.mood)}</span>
            )}
          </div>
          <p className={cn('text-sm text-slate-500', !expanded && 'line-clamp-2')}>
            &ldquo;{preview}&rdquo;
          </p>
        </div>
        <BookOpen className={cn('w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5 transition-transform', expanded && 'rotate-180')} />
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 animate-fade-in">
          {note.accomplishment && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Accomplished</p>
              <p className="text-sm text-slate-700">{note.accomplishment}</p>
            </div>
          )}
          {note.learning && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Learned</p>
              <p className="text-sm text-slate-700">{note.learning}</p>
            </div>
          )}
          {note.difficulty && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Difficulty</p>
              <p className="text-sm text-slate-700">{note.difficulty}</p>
            </div>
          )}
          {note.tomorrow && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Tomorrow</p>
              <p className="text-sm text-slate-700">{note.tomorrow}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
