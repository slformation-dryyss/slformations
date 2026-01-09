"use client";

import { useState } from "react";
import { Users, CreditCard, Mail, Calendar, ExternalLink } from "lucide-react";
import { CreatePaymentLinkSimpleModal } from "@/components/admin/CreatePaymentLinkSimpleModal";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  enrollments: Array<{
    course: {
      title: string;
      price: number;
    };
  }>;
  paymentLinks: Array<{
    id: string;
    amount: number;
    status: string;
    expiresAt: Date | null;
    stripeUrl: string;
    course: {
      title: string;
    } | null;
  }>;
};

type Course = {
  id: string;
  title: string;
  price: number;
};

interface ParticipantsClientProps {
  users: User[];
  courses: Course[];
}

export function ParticipantsClient({ users, courses }: ParticipantsClientProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleCreatePaymentLink = (user: User) => {
    setSelectedUser(user);
    setShowPaymentModal(true);
  };

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Participants</h1>
        <p className="text-slate-600">
          Gérez les élèves inscrits et générez des liens de paiement
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" />
              <h2 className="text-lg font-bold text-slate-900">
                Liste des participants ({users.length})
              </h2>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-4 font-semibold">Participant</th>
                <th className="p-4 font-semibold">Inscriptions</th>
                <th className="p-4 font-semibold">Paiements en attente</th>
                <th className="p-4 font-semibold">Inscription</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                    Aucun participant trouvé
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-slate-900">
                          {user.name || "Sans nom"}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {user.enrollments.length > 0 ? (
                          <div className="space-y-1">
                            {user.enrollments.map((enrollment, idx) => (
                              <div key={idx} className="text-slate-700">
                                {enrollment.course.title}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Aucune</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {user.paymentLinks.length > 0 ? (
                        <div className="space-y-2">
                          {user.paymentLinks.map((link) => (
                            <div
                              key={link.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="font-medium text-gold-600">
                                {link.amount}€
                              </span>
                              <span className="text-slate-500">
                                {link.course?.title || "Paiement personnalisé"}
                              </span>
                              <Link
                                href={link.stripeUrl}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-sm">Aucun</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleCreatePaymentLink(user)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gold-500 text-navy-900 rounded-lg text-sm font-semibold hover:bg-gold-600 transition"
                        >
                          <CreditCard className="w-4 h-4" />
                          Créer un lien de paiement
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && selectedUser && (
        <CreatePaymentLinkSimpleModal
          userId={selectedUser.id}
          userName={selectedUser.name || selectedUser.email}
          userEmail={selectedUser.email}
          courses={courses}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

