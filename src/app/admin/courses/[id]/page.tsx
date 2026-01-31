
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash, Video, FileText, CheckCircle, Eye } from "lucide-react";
import {
    updateCourseAction,
    createModuleAction,
    updateModuleAction,
    deleteModuleAction,
    createLessonAction,
    deleteLessonAction
} from "../actions";

async function getCourse(id: string) {
    return await prisma.course.findUnique({
        where: { id },
        include: {
            modules: {
                orderBy: { position: "asc" },
                include: {
                    lessons: {
                        orderBy: { position: "asc" }
                    },
                    quiz: true
                }
            }
        }
    });
}

export default async function CMSCoursePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    await requireAdmin();
    const course = await getCourse(id);

    if (!course) notFound();

    return (
        <div className="pb-20">
            <div className="mb-6 flex items-center justify-between">
                <Link
                    href="/admin/courses"
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour aux formations
                </Link>
                <Link
                    href={`/formations/${course.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    Voir la page publique
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Curriculum */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{course.title}</h1>
                        <p className="text-slate-500">{course.modules.length} Modules • {course.price} €</p>
                    </div>

                    {/* Modules List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Programme (Curriculum)</h2>
                        </div>

                        {course.modules.length === 0 ? (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-12 text-center text-slate-500">
                                <p className="mb-4">Aucun module pour le moment.</p>
                                <p className="text-sm">Utilisez le formulaire à droite pour ajouer votre premier chapitre.</p>
                            </div>
                        ) : (
                            course.modules.map((module) => (
                                <div key={module.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex flex-col flex-1 gap-2">
                                                <form id={`update-module-${module.id}`} action={updateModuleAction} className="flex flex-wrap items-center gap-4">
                                                    <input type="hidden" name="moduleId" value={module.id} />
                                                    <input type="hidden" name="courseId" value={course.id} />

                                                    <input
                                                        type="text"
                                                        name="title"
                                                        defaultValue={module.title}
                                                        className="font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-gold-500 focus:outline-none px-1 flex-1"
                                                    />

                                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                                        <span>Jour</span>
                                                        <input
                                                            type="number"
                                                            name="dayNumber"
                                                            defaultValue={module.dayNumber || 1}
                                                            className="w-10 font-bold text-slate-900 focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                                        <span>Durée (h)</span>
                                                        <input
                                                            type="number"
                                                            name="duration"
                                                            defaultValue={module.duration || 7}
                                                            className="w-10 font-bold text-slate-900 focus:outline-none"
                                                        />
                                                    </div>

                                                    <button type="submit" className="text-gold-600 hover:text-gold-700 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                </form>
                                                <textarea
                                                    name="description"
                                                    form={`update-module-${module.id}`}
                                                    defaultValue={module.description || ""}
                                                    placeholder="Description du module / Objectifs (optionnel)"
                                                    className="w-full text-xs text-slate-500 bg-transparent border-none focus:ring-0 focus:outline-none resize-none h-8 hover:h-20 transition-all p-1"
                                                ></textarea>
                                                {/* We need to move the form around if we want a single submit button for both fields */}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {module.quiz ? (
                                                <Link
                                                    href={`/admin/courses/quizzes/${module.quiz.id}`}
                                                    className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded border border-amber-200 hover:bg-amber-200 transition"
                                                >
                                                    Gérer le Quiz
                                                </Link>
                                            ) : (
                                                <form action={async (formData) => {
                                                    'use server';
                                                    const { createQuizAction } = await import("../quizzes/actions");
                                                    await createQuizAction(formData);
                                                }}>
                                                    <input type="hidden" name="title" value={`Quiz : ${module.title}`} />
                                                    <input type="hidden" name="moduleId" value={module.id} />
                                                    <input type="hidden" name="courseId" value={course.id} />
                                                    <button
                                                        type="submit"
                                                        className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition"
                                                    >
                                                        Ajouter un Quiz
                                                    </button>
                                                </form>
                                            )}
                                            <form action={deleteModuleAction}>
                                                <input type="hidden" name="moduleId" value={module.id} />
                                                <input type="hidden" name="courseId" value={course.id} />
                                                <button className="text-slate-400 hover:text-red-500 transition-colors" title="Supprimer le module">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-slate-100">
                                        {module.lessons.map((lesson) => (
                                            <div key={lesson.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    {lesson.videoUrl ? (
                                                        <Video className="w-4 h-4 text-slate-400" />
                                                    ) : (
                                                        <FileText className="w-4 h-4 text-slate-400" />
                                                    )}
                                                    <span className="text-sm text-slate-700">{lesson.title}</span>
                                                    {lesson.isFree && (
                                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                                                            Gratuit
                                                        </span>
                                                    )}
                                                </div>
                                                <form action={deleteLessonAction}>
                                                    <input type="hidden" name="lessonId" value={lesson.id} />
                                                    <input type="hidden" name="courseId" value={course.id} />
                                                    <button className="text-slate-300 hover:text-red-400 transition-colors">
                                                        <Trash className="w-3 h-3" />
                                                    </button>
                                                </form>
                                            </div>
                                        ))}

                                        {/* Add Lesson Form */}
                                        <div className="bg-slate-50 p-4 border-t border-slate-100">
                                            <details className="group">
                                                <summary className="list-none cursor-pointer text-sm text-gold-600 font-medium flex items-center gap-1 hover:text-gold-700">
                                                    <Plus className="w-4 h-4" /> Ajouter une leçon dans ce module
                                                </summary>
                                                <form action={createLessonAction} className="mt-3 space-y-3 pl-2 border-l-2 border-gold-200">
                                                    <input type="hidden" name="moduleId" value={module.id} />
                                                    <input type="hidden" name="courseId" value={course.id} />

                                                    <input
                                                        type="text"
                                                        name="title"
                                                        placeholder="Titre de la leçon"
                                                        required
                                                        className="block w-full text-sm rounded border-slate-300 p-2"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="videoUrl"
                                                        placeholder="URL Vidéo (Youtube/Vimeo/MP4)"
                                                        className="block w-full text-sm rounded border-slate-300 p-2"
                                                    />
                                                    <textarea
                                                        name="content"
                                                        placeholder="Description / Contenu texte..."
                                                        className="block w-full text-sm rounded border-slate-300 p-2 h-20"
                                                    ></textarea>

                                                    <div className="flex items-center gap-2">
                                                        <input type="checkbox" name="isFree" id={`free-${module.id}`} />
                                                        <label htmlFor={`free-${module.id}`} className="text-xs text-slate-600">
                                                            Accessible gratuitement (Preview)
                                                        </label>
                                                    </div>

                                                    <button type="submit" className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded hover:bg-slate-700">
                                                        Enregistrer la leçon
                                                    </button>
                                                </form>
                                            </details>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Create Module UI */}
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-gold-300 transition-colors">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">Nouveau Module</h3>
                            <form action={createModuleAction} className="space-y-4">
                                <input type="hidden" name="courseId" value={course.id} />
                                <div className="flex flex-wrap gap-3">
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Titre du module (ex: Introduction)"
                                        required
                                        className="flex-1 min-w-[200px] rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                                    />
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold text-slate-500">Jour</label>
                                        <input
                                            type="number"
                                            name="dayNumber"
                                            placeholder="1"
                                            className="w-16 rounded-md border-slate-300 shadow-sm sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold text-slate-500">Heures</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            placeholder="7"
                                            className="w-16 rounded-md border-slate-300 shadow-sm sm:text-sm p-2 border"
                                        />
                                    </div>
                                </div>
                                <textarea
                                    name="description"
                                    placeholder="Description optionnelle du module..."
                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border h-20"
                                ></textarea>
                                <button type="submit" className="w-full bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800">
                                    Ajouter Module
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Save className="w-5 h-5 text-gold-500" />
                            Paramètres
                        </h3>

                        <form action={updateCourseAction} className="space-y-4">
                            <input type="hidden" name="courseId" value={course.id} />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                                <input type="text" name="title" defaultValue={course.title} className="w-full text-sm border-slate-300 rounded p-2 border" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                <input type="text" name="imageUrl" defaultValue={course.imageUrl || ""} className="w-full text-sm border-slate-300 rounded p-2 border" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Prix (€)</label>
                                <input type="number" name="price" defaultValue={course.price} className="w-full text-sm border-slate-300 rounded p-2 border" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre d'heures de conduite (si applicable)</label>
                                <input type="number" name="drivingHours" defaultValue={course.drivingHours || 0} className="w-full text-sm border-slate-300 rounded p-2 border" placeholder="Ex: 20 pour un pack permis B" />
                                <p className="text-[10px] text-slate-400 mt-1 italic">Crédit automatique au solde de l'élève après paiement.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Limite de Participants (0 = illimité)</label>
                                <input type="number" name="maxStudents" defaultValue={course.maxStudents || 0} className="w-full text-sm border-slate-300 rounded p-2 border" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded border border-slate-200">
                                    <input type="checkbox" name="isPublished" defaultChecked={course.isPublished} className="h-4 w-4 text-gold-600 rounded border-gray-300" />
                                    <span className="text-sm text-slate-700">Publié (Visible sur le site)</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Durée Affichée</label>
                                <input type="text" name="durationText" defaultValue={course.durationText || ""} className="w-full text-sm border-slate-300 rounded p-2 border" placeholder="Ex: 77 heures (11 jours)" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
                                <input type="text" name="formatText" defaultValue={course.formatText || ""} className="w-full text-sm border-slate-300 rounded p-2 border" placeholder="Ex: Présentiel, Distanciel..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                <select name="type" defaultValue={course.type} className="w-full text-sm border-slate-300 rounded p-2 border">
                                    <option value="PERMIS">Permis</option>
                                    <option value="TRANSPORT">Transport</option>
                                    <option value="CACES">CACES</option>
                                    <option value="SECOURISME">Secourisme / SST</option>
                                    <option value="INCENDIE">Incendie / SSIAP</option>
                                    <option value="CYBER">Cyber (Tech)</option>
                                    <option value="DEV">Dev (Tech)</option>
                                    <option value="MARKETING">Marketing (Tech)</option>
                                    <option value="DESIGN">Design (Tech)</option>
                                    <option value="AUTRE">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Courte)</label>
                                <textarea name="description" rows={3} defaultValue={course.description} className="w-full text-sm border-slate-300 rounded p-2 border" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Objectifs (Pédagogiques)</label>
                                <textarea name="objectives" rows={3} defaultValue={course.objectives || ""} className="w-full text-sm border-slate-300 rounded p-2 border" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Public Visé</label>
                                <textarea name="targetAudience" rows={2} defaultValue={course.targetAudience || ""} className="w-full text-sm border-slate-300 rounded p-2 border" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Débouchés / Perspectives</label>
                                <textarea name="prospects" rows={2} defaultValue={course.prospects || ""} className="w-full text-sm border-slate-300 rounded p-2 border" />
                            </div>

                            <button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold py-2 rounded transition-colors flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" />
                                Enregistrer les modifications
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

