import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Clock, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminDocumentsPage() {
  await requireAdmin();

  // Find users who should have a dossier:
  // 1. Have uploaded documents
  // 2. OR are enrolled in a course
  // 3. OR have a payment link generated for them
  const usersWithDossier = await prisma.user.findMany({
    where: {
       OR: [
           { documents: { some: {} } },
           { enrollments: { some: {} } },
           { paymentLinks: { some: {} } }
       ]
    },
    select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        onboardingStatus: true,
        createdAt: true,
        documents: {
            select: { status: true }
        }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Dossiers Élèves</h1>
      <p className="text-slate-500 mb-8">Gérez les pièces justificatives des candidats.</p>
      
      <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
         <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
               <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Élève</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">État Dossier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
               </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
               {usersWithDossier.length === 0 ? (
                   <tr>
                       <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                           Aucun dossier documentaire trouvé.
                       </td>
                   </tr>
               ) : (
                   (usersWithDossier as any[]).map(user => {
                       const pendingCount = user.documents.filter((d: any) => d.status === "PENDING").length;
                       const rejectedCount = user.documents.filter((d: any) => d.status === "REJECTED").length;
                       const approvedCount = user.documents.filter((d: any) => d.status === "APPROVED").length;
                       const totalCount = user.documents.length;
                       
                       const REQUIRED_COUNT = 4; // Based on constants.ts
                       
                       let statusBadge;
                       if (pendingCount > 0) {
                           statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/> À réviser ({pendingCount})</span>
                       } else if (rejectedCount > 0) {
                           statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1"/> Refusé</span>
                       } else if (approvedCount === REQUIRED_COUNT) {
                           statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Complet</span>
                       } else if (totalCount > 0) {
                           statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">Incomplet ({approvedCount}/{REQUIRED_COUNT})</span>
                       } else {
                           statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Aucun document</span>
                       }

                       const displayName = user.firstName && user.lastName 
                         ? `${user.firstName} ${user.lastName}` 
                         : user.email;

                       return (
                           <tr key={user.id} className="hover:bg-slate-50">
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="flex items-center">
                                       <div className="h-10 w-10 flex-shrink-0 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                            {displayName.charAt(0).toUpperCase()}
                                       </div>
                                       <div className="ml-4">
                                           <div className="text-sm font-medium text-slate-900">{displayName}</div>
                                           <div className="text-sm text-slate-500">{user.email}</div>
                                       </div>
                                   </div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                   {statusBadge}
                                   <div className="text-xs text-slate-400 mt-1">Status global: {user.onboardingStatus}</div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                   {totalCount} document(s)
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                   <Link href={`/admin/documents/${user.id}`} className="text-indigo-600 hover:text-indigo-900 font-bold">
                                       Gérer
                                   </Link>
                               </td>
                           </tr>
                       )
                   })
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}

