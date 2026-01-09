"use client";

import { useState } from "react";
import { createSessionSlotAction, deleteSessionSlotAction } from "@/app/admin/sessions/actions";
import { Trash2, Plus, Calendar as CalendarIcon, MapPin, Video, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Module {
  id: string;
  title: string;
}

interface Teacher {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
}

interface ItemSlot {
  id: string;
  start: Date;
  end: Date;
  moduleId: string | null;
  teacherId: string | null;
  location: string | null;
  meetingUrl: string | null;
  module?: { title: string } | null;
  teacher?: { name: string | null; firstName: string | null; lastName: string | null } | null;
}

interface SessionPlanningProps {
  sessionId: string;
  modules: Module[];
  teachers: Teacher[];
  slots: ItemSlot[];
}

export function SessionPlanning({ sessionId, modules, teachers, slots }: SessionPlanningProps) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Planning Détaillé</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un créneau
        </button>
      </div>

      {isAdding && (
         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Nouveau Créneau</h4>
            <form action={async (formData) => {
                await createSessionSlotAction(formData);
                setIsAdding(false);
            }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="hidden" name="sessionId" value={sessionId} />
                
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Date & Heure Début</label>
                    <input type="datetime-local" name="start" required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border" />
                </div>
                <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">Date & Heure Fin</label>
                    <input type="datetime-local" name="end" required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Module (Optionnel)</label>
                    <select name="moduleId" className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border bg-white">
                        <option value="">-- Aucun / Général --</option>
                        {modules.map(m => (
                            <option key={m.id} value={m.id}>{m.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Formateur (Optionnel)</label>
                    <select name="teacherId" className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border bg-white">
                        <option value="">-- Non assigné --</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.firstName} {t.lastName || t.name}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Lieu (Si différent)</label>
                        <div className="relative">
                            <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                            <input type="text" name="location" placeholder="Ex: Salle 3" className="block w-full rounded-md border-slate-300 pl-8 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Lien Visio (Teams/Skype)</label>
                        <div className="relative">
                            <Video className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                            <input type="url" name="meetingUrl" placeholder="https://..." className="block w-full rounded-md border-slate-300 pl-8 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border" />
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800">Annuler</button>
                    <button type="submit" className="bg-gold-500 text-slate-900 px-4 py-2 rounded-md hover:bg-gold-400 text-sm font-medium shadow-sm">Créer le créneau</button>
                </div>
            </form>
         </div>
      )}

      <div className="space-y-3">
        {slots.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <CalendarIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Aucun créneau planifié pour le moment.</p>
            </div>
        ) : (
            slots.sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((slot) => (
                <div key={slot.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-gold-200 transition-colors">
                    
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                             <div className="bg-slate-100 rounded px-2 py-1 flex flex-col items-center min-w-[60px]">
                                <span className="text-xs font-bold text-slate-500 uppercase">{format(new Date(slot.start), 'MMM', { locale: fr })}</span>
                                <span className="text-xl font-bold text-slate-900">{format(new Date(slot.start), 'dd')}</span>
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                     <h4 className="font-semibold text-slate-900">
                                        {format(new Date(slot.start), 'HH:mm')} - {format(new Date(slot.end), 'HH:mm')}
                                    </h4>
                                    {slot.meetingUrl && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                            <Video className="w-3 h-3 mr-1" /> Visio
                                        </span>
                                    )}
                                </div>
                                
                                {slot.module ? (
                                    <p className="text-sm text-slate-600 font-medium">{slot.module.title}</p>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Module Général</p>
                                )}
                             </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500 pl-[72px]">
                            {slot.teacher && (
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {slot.teacher.firstName} {slot.teacher.lastName}
                                </div>
                            )}
                            {slot.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {slot.location}
                                </div>
                            )}
                        </div>
                    </div>

                    <form action={deleteSessionSlotAction} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <input type="hidden" name="slotId" value={slot.id} />
                        <input type="hidden" name="sessionId" value={sessionId} />
                        <button className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            ))
        )}
      </div>
    </div>
  );
}

