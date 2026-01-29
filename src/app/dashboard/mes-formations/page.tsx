'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChartLine,
  CreditCard,
  MessageSquare,
  Plus,
  User,
  Users,
  Clock,
  Play,
  ArrowRight
} from "lucide-react";
import { DownloadCertificateButton } from "@/components/courses/DownloadCertificateButton";

type Enrollment = {
  id: string;
  courseId: string;
  title: string;
  slug: string | null;
  imageUrl: string | null;
  progress: number;
  distanceProgress?: number;
  sessionProgress?: number;
  hasDistance?: boolean;
  hasSessions?: boolean;
  lastLessonId?: string | null;
  status: string;
  lastAccessedAt: string;
  enrollmentCreatedAt: string;
  totalModules: number;
};

type Stats = {
  activeCourses: number;
  completedHours: number;
  totalHours: number;
};

export default function DashboardMesFormationsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [stats, setStats] = useState<Stats>({ activeCourses: 0, completedHours: 0, totalHours: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/enrollments');
        if (res.ok) {
          const data = await res.json();
          setEnrollments(data.enrollments);
          setStats(data.stats);
          setUser(data.user);
        }
      } catch (e) {
        console.error("Failed to load enrollments", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Contenu principal */}
          <section className="w-full">
            {/* En-tête page */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Mes formations
                </h1>
                <p className="text-slate-500 text-sm md:text-base">
                  Suivez votre progression et accédez à vos cours.
                </p>
              </div>
              <Link href="/formations" className="hidden sm:inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/40 transition">
                <Plus className="w-4 h-4" />
                <span>Nouvelle formation</span>
              </Link>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{stats.activeCourses}</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Formations actives</h3>
                <p className="text-slate-500 text-xs">En cours</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{stats.completedHours}h</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Heures effectuées</h3>
                <p className="text-slate-500 text-xs">Sur {stats.totalHours}h (est.)</p>
              </div>

              {/* ... Autres stats si besoin, ou on simplifie ... */}
            </div>

            {/* Liste des formations */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500">Chargement de vos cours...</p>
              </div>
            ) : enrollments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map(enrollment => (
                  <div key={enrollment.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
                    <div className="relative h-40 bg-slate-900">
                      {enrollment.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={enrollment.imageUrl} alt={enrollment.title} className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur rounded text-xs font-bold text-white uppercase">
                        {enrollment.status === 'ACTIVE' ? 'En cours' : 'Terminé'}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 h-14" title={enrollment.title}>
                        {enrollment.title}
                      </h3>
                      <div className="space-y-4 mb-4">
                        {/* Progression E-Learning / Distance */}
                        {enrollment.hasDistance && (
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">
                              <span className="flex items-center gap-1">
                                <Play className="w-2.5 h-2.5" />
                                Théorie / E-learning
                              </span>
                              <span>{enrollment.distanceProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div
                                className="bg-gold-500 h-1.5 rounded-full transition-all duration-1000"
                                style={{ width: `${enrollment.distanceProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Progression Sessions / Présentiel */}
                        {enrollment.hasSessions && (
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">
                              <span className="flex items-center gap-1">
                                <Users className="w-2.5 h-2.5" />
                                Sessions / Présentiel
                              </span>
                              <span>{enrollment.sessionProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                                style={{ width: `${enrollment.sessionProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {!enrollment.hasDistance && !enrollment.hasSessions && (
                          <div>
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                              <span>Progression globale</span>
                              <span>{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div className="bg-gold-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${enrollment.progress}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-slate-400">
                          {enrollment.totalModules} modules
                        </span>
                        {/* Lien vers le player ou page détail */}
                        <div className="flex items-center gap-2">
                          {enrollment.progress === 100 && user && (
                            <DownloadCertificateButton
                              userName={`${user.firstName} ${user.lastName}`}
                              courseTitle={enrollment.title}
                              startDate={new Date(enrollment.enrollmentCreatedAt).toLocaleDateString()}
                              endDate={new Date(enrollment.lastAccessedAt).toLocaleDateString()}
                              duration={35}
                              variant="outline"
                            />
                          )}
                          <Link
                            href={`/learn/${enrollment.slug || enrollment.courseId}${enrollment.lastLessonId ? `/${enrollment.lastLessonId}` : ""}`}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            {enrollment.lastLessonId ? "Reprendre" : "Continuer"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">Aucune formation en cours</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  Vous n'êtes inscrit à aucune formation pour le moment. Découvrez nos programmes et commencez votre apprentissage.
                </p>
                <Link
                  href="/formations"
                  className="inline-flex items-center px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-600 transition"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Découvrir les formations
                </Link>
              </div>
            )}

          </section>
        </div>
      </div>
    </>
  );
}









