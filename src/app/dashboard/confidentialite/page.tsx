import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Shield, Download, Trash2, FileText, CheckCircle, XCircle } from "lucide-react";

export default async function PrivacyCenterPage() {
  const user = await requireUser();
  
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      gdprConsent: true,
      gdprConsentDate: true,
      marketingConsent: true,
      consentLogs: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      dataExportRequests: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-gold-500" />
              <h1 className="text-3xl font-bold text-slate-900">Centre de Confidentialité</h1>
            </div>
            <p className="text-slate-600">
              Gérez vos données personnelles et vos préférences de confidentialité conformément au RGPD.
            </p>
          </div>
          
          {/* Consent Management */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Gestion des Consentements</h2>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">Consentement RGPD</h3>
                  <p className="text-sm text-slate-600">
                    Traitement de vos données personnelles pour la gestion de votre compte et de vos formations.
                  </p>
                  {userData?.gdprConsentDate && (
                    <p className="text-xs text-slate-500 mt-2">
                      Accordé le {new Date(userData.gdprConsentDate).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  {userData?.gdprConsent ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Actif</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Inactif</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">Communications Marketing</h3>
                  <p className="text-sm text-slate-600">
                    Recevoir des offres promotionnelles et des actualités sur nos formations.
                  </p>
                </div>
                <div className="ml-4">
                  <form action="/api/user/consent" method="POST">
                    <input type="hidden" name="consentType" value="MARKETING" />
                    <input type="hidden" name="isGranted" value={userData?.marketingConsent ? "false" : "true"} />
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        userData?.marketingConsent
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {userData?.marketingConsent ? 'Désactiver' : 'Activer'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Export */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Export de Données</h2>
            <p className="text-slate-600 mb-6">
              Téléchargez une copie complète de toutes vos données personnelles stockées sur notre plateforme.
            </p>
            
            <form action="/api/user/data-export" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
              >
                <Download className="w-5 h-5" />
                Demander un export de données
              </button>
            </form>
            
            {userData?.dataExportRequests && userData.dataExportRequests.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-slate-900 mb-3">Demandes récentes</h3>
                <div className="space-y-2">
                  {userData.dataExportRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm">
                      <div>
                        <span className="text-slate-700">
                          {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                          request.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          request.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                          request.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      {request.exportUrl && (
                        <a
                          href={request.exportUrl}
                          className="text-gold-600 hover:text-gold-700 font-medium"
                        >
                          Télécharger
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Consent History */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Historique des Consentements</h2>
            <p className="text-slate-600 mb-6">
              Traçabilité complète de vos choix de confidentialité.
            </p>
            
            {userData?.consentLogs && userData.consentLogs.length > 0 ? (
              <div className="space-y-2">
                {userData.consentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{log.consentType}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        log.isGranted ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.isGranted ? 'Accordé' : 'Refusé'}
                      </span>
                    </div>
                    <span className="text-slate-500 text-xs">
                      {new Date(log.createdAt).toLocaleDateString('fr-FR')} à {new Date(log.createdAt).toLocaleTimeString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Aucun historique disponible.</p>
            )}
          </div>
          
          {/* Account Deletion */}
          <div className="mt-6 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-4">
              <Trash2 className="w-6 h-6 text-red-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-2">Suppression de compte</h3>
                <p className="text-sm text-red-700 mb-4">
                  La suppression de votre compte est définitive et irréversible. Toutes vos données seront supprimées.
                </p>
                <a
                  href="mailto:contact@sl-formations.fr?subject=Demande de suppression de compte"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  Demander la suppression
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

