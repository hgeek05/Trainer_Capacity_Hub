"use client";

import React, { useState, useEffect } from "react";
import { 
  User, Mail, Building, Briefcase, Sparkles, Check, X, 
  ShieldCheck, Phone, FileText, Lock, Loader2, AlertCircle 
} from "lucide-react";
import { getProfileApi, updateProfileApi, type ProfileData } from "@/lib/api";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updatedProfile: any) => void;
}

export function EditProfileModal({ isOpen, onClose, onProfileUpdated }: EditProfileModalProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    job_title: "Formateur HSE",
    home_center_id: 1,
    specialty_id: 2,
    phone: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Charger l'utilisateur connecté et son profil en DB
  useEffect(() => {
    if (!isOpen) return;

    try {
      const stored = localStorage.getItem("current_user");
      if (stored) {
        const user = JSON.parse(stored);
        setCurrentUser(user);

        // Découper le nom si nécessaire
        const nameParts = (user.name || "").trim().split(" ");
        const defaultFirst = nameParts[0] || "";
        const defaultLast = nameParts.slice(1).join(" ") || "";

        setFormData({
          first_name: defaultFirst,
          last_name: defaultLast,
          job_title: user.role === "Formateur" ? "Formateur Interne" : "Planning Manager",
          home_center_id: user.center === "Safi" ? 2 : user.center === "Jorf Lasfar" ? 3 : user.center === "Khouribga" ? 4 : 1,
          specialty_id: 2,
          phone: "+212 6 00 00 00 00",
          bio: "Formateur & Collaborateur au sein de l'écosystème UM6P TechniX.",
        });

        // Récupérer depuis l'API backend si l'ID est disponible
        if (user.id) {
          setIsFetching(true);
          getProfileApi(user.id)
            .then((prof) => {
              if (prof) {
                setFormData({
                  first_name: prof.first_name || defaultFirst,
                  last_name: prof.last_name || defaultLast,
                  job_title: prof.job_title || (user.role === "Formateur" ? "Formateur Interne" : "Planning Manager"),
                  home_center_id: prof.home_center_id || 1,
                  specialty_id: prof.specialty_id || 2,
                  phone: prof.phone || "+212 6 00 00 00 00",
                  bio: prof.bio || "",
                });
              }
            })
            .catch((err) => console.warn("Failed to fetch fresh profile from DB:", err))
            .finally(() => setIsFetching(false));
        }
      }
    } catch (e) {
      console.warn("Failed to load user info for profile modal:", e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const userRole = currentUser?.role || "Formateur";
  const isTrainer = userRole === "Formateur";
  const userEmail = currentUser?.email || "f.aitzzi@um6p.ma";
  const employeeId = currentUser?.employee_id || "EMP-004";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (currentUser?.id) {
        const res = await updateProfileApi(currentUser.id, formData);
        if (res && res.profile) {
          // Mettre à jour l'état local dans localStorage
          const updatedUser = {
            ...currentUser,
            name: `${formData.first_name} ${formData.last_name}`.trim(),
            center: formData.home_center_id === 2 ? "Safi" : formData.home_center_id === 3 ? "Jorf Lasfar" : formData.home_center_id === 4 ? "Khouribga" : "Ben Guerir",
          };
          localStorage.setItem("current_user", JSON.stringify(updatedUser));
          if (onProfileUpdated) {
            onProfileUpdated(updatedUser);
          }
        }
      }

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Profile update error:", err);
      setErrorMsg(err?.message || "Erreur lors de la mise à jour du profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 text-xs text-slate-700 max-h-[90vh] overflow-y-auto">
        
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#E04F26]/10 text-[#E04F26] rounded-xl">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Modifier mon profil</h2>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {userRole}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Gérez vos informations professionnelles et personnelles</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="size-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900">Modifications enregistrées !</p>
            <p className="text-slate-400 text-[11px]">Votre profil a été mis à jour avec succès en base de données.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Champs en lecture seule (Matricule & Email institutionnel) */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Identifiants institutionnels (Vérifiés UM6P)</span>
                </div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Lecture seule
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400">Matricule :</span>
                  <span className="ml-1 font-mono font-semibold text-slate-800">
                    {employeeId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Email :</span>
                  <span className="ml-1 font-medium text-slate-800 truncate block sm:inline">
                    {userEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Prénom & Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prénom</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#E04F26]/20 focus:border-[#E04F26] focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#E04F26]/20 focus:border-[#E04F26] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Intitulé de Poste / Fonction */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fonction / Poste</label>
              <div className="relative">
                <input
                  type="text"
                  disabled={isTrainer}
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  className={`w-full border rounded-xl pl-8 pr-3 py-2 text-slate-800 transition-all ${
                    isTrainer 
                      ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" 
                      : "bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#E04F26]/20 focus:border-[#E04F26] focus:outline-none"
                  }`}
                />
                <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              {isTrainer && (
                <span className="text-[10px] text-slate-400 mt-1 block">Attribué par les Ressources Humaines</span>
              )}
            </div>

            {/* Centre de rattachement & Spécialité */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Centre de rattachement</label>
                {isTrainer ? (
                  <input
                    type="text"
                    disabled
                    value={formData.home_center_id === 2 ? "Safi" : formData.home_center_id === 3 ? "Jorf Lasfar" : formData.home_center_id === 4 ? "Khouribga" : "Ben Guerir Campus (AaiT)"}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed text-xs"
                  />
                ) : (
                  <select
                    value={formData.home_center_id}
                    onChange={(e) => setFormData({ ...formData, home_center_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#E04F26]/20 focus:outline-none"
                  >
                    <option value={1}>Ben Guerir (AaiT)</option>
                    <option value={2}>Safi</option>
                    <option value={3}>Jorf Lasfar</option>
                    <option value={4}>Khouribga</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domaine / Spécialité</label>
                {isTrainer ? (
                  <input
                    type="text"
                    disabled
                    value={formData.specialty_id === 1 ? "Digital & Data" : formData.specialty_id === 2 ? "HSE & Sécurité" : formData.specialty_id === 3 ? "Maintenance" : "Procédés"}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed text-xs"
                  />
                ) : (
                  <select
                    value={formData.specialty_id}
                    onChange={(e) => setFormData({ ...formData, specialty_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#E04F26]/20 focus:outline-none"
                  >
                    <option value={1}>Digital & Data</option>
                    <option value={2}>HSE & Sécurité</option>
                    <option value={3}>Maintenance Industrielle</option>
                    <option value={4}>Chimie et procédés</option>
                    <option value={5}>Industrie minière</option>
                  </select>
                )}
              </div>
            </div>

            {/* Téléphone & Bio */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Numéro de Téléphone</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+212 6 00 00 00 00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#E04F26]/20 focus:border-[#E04F26] focus:outline-none"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Biographie / Note personnelle</label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Quelques mots sur vos activités ou expertises..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#E04F26]/20 focus:border-[#E04F26] focus:outline-none text-xs resize-none"
              />
            </div>

            {/* Boutons d'actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#E04F26] hover:bg-[#CC3B14] text-white font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <span>Enregistrer les modifications</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default EditProfileModal;
