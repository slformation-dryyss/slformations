"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LogOut, AlertTriangle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT = 1 * 60 * 1000; // 1 minute warning before logout

export function IdleLogout() {
  const { user } = useUser();
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_TIMEOUT / 1000);
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(() => {
    window.location.href = "/api/auth/logout";
  }, []);

  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    
    setIsWarningVisible(false);
    
    idleTimerRef.current = setTimeout(() => {
      setIsWarningVisible(true);
      setSecondsLeft(WARNING_TIMEOUT / 1000);
      
      warningTimerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, IDLE_TIMEOUT - WARNING_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    if (!user) return;

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const resetTimer = () => {
      if (!isWarningVisible) {
        startIdleTimer();
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    startIdleTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    };
  }, [user, isWarningVisible, startIdleTimer]);

  const stayLoggedIn = () => {
    setIsWarningVisible(false);
    startIdleTimer();
  };

  return (
    <AnimatePresence>
      {isWarningVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full border border-slate-200 text-center relative overflow-hidden"
          >
            {/* Background Decorative Elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100 shadow-inner">
                <AlertTriangle className="w-10 h-10 text-amber-500" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                Session bientôt expirée
              </h2>
              
              <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                Vous avez été inactif pendant un moment. Par mesure de sécurité, vous serez déconnecté automatiquement dans :
              </p>

              <div className="flex items-center justify-center gap-3 mb-10">
                <div className="bg-slate-950 text-white rounded-2xl px-6 py-4 flex items-center gap-3 shadow-xl">
                  <Clock className="w-6 h-6 text-gold-500" />
                  <span className="text-3xl font-black tabular-nums">
                    {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={stayLoggedIn}
                  className="w-full bg-slate-950 text-white font-black py-4 rounded-2xl hover:bg-navy-950 transition-all shadow-xl shadow-slate-950/20 active:scale-[0.98]"
                >
                  Rester connecté
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter maintenant
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
