"use client";

import React, { useState, useEffect } from "react";
import { X, User, Phone, Briefcase, ShieldCheck, Check, AlertCircle, Loader2, Lock } from "lucide-react";
import { getProfileApi, updateProfileApi, ProfileData } from "@/lib/api/endpoints";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updatedUser: any) => void;
}

export function EditProfileModal({ isOpen, onClose, onProfileUpdated }: EditProfileModalProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    bio: "",
    job_title: "",
    home_center_id: 1,
    specialty_id: 1,
  });

  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeId, setEmployeeId] = useState("EMP-000");

  useEffect(() => {
    if (!isOpen) return;

    setErrorMsg(null);
    setSuccessMsg(false);

    try {
      const stored = localStorage.getItem("current_user");
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        setUserEmail(u.email || "");
        setUserRole(u.role || "Formateur");

        const [fName, ...lNameParts] = (u.name || "").split(" ");
        setFormData((prev) => ({
          ...prev,
          first_name: fName || "",
          last_name: lNameParts.join(" ") || "",
        }));

        if (u.id) {
          setIsFetching(true);
          getProfileApi(u.id)
            .then((prof) => {
              if (prof) {
                setEmployeeId(prof.employee_id || `EMP-${String(u.id).padStart(3, "0")}`);
                setFormData({
                  first_name: prof.first_name || fName || "",
                  last_name: prof.last_name || lNameParts.join(" ") || "",
                  phone: prof.phone || "",
                  bio: prof.bio || "",
                  job_title: prof.job_title || (u.role === "Formateur" ? "Formateur HSE" : "Planning & Capacity Manager"),
                  home_center_id: prof.home_center_id || 1,
                  specialty_id: prof.specialty_id || 1,
                });
              }
            })
            .catch((e) => console.warn("Failed to fetch user profile:", e))
            .finally(() => setIsFetching(false));
        } else {
          setIsFetching(false);
        }
      }
    } catch (e) {
      console.warn("Failed to load current user for profile modal:", e);
      setIsFetching(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isTrainer = userRole === "Formateur";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setErrorMsg("Le prénom et le nom sont obligatoires.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const userId = currentUser?.id || 1;
      const updated = await updateProfileApi(userId, {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        ...(!isTrainer ? {
          job_title: formData.job_title.trim(),
          home_center_id: formData.home_center_id,
          specialty_id: formData.specialty_id,
        } : {}),
      });

      const fullName = `${formData.first_name.trim()} ${formData.last_name.trim()}`;
      const updatedUserObj = {
        ...currentUser,
        name: fullName,
      };
      localStorage.setItem("current_user", JSON.stringify(updatedUserObj));

      if (onProfileUpdated) {
        onProfileUpdated(updatedUserObj);
      }

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Update profile error:", err);
      setErrorMsg(err?.message || "Erreur lors de la mise à jour du profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card text-foreground rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border text-xs max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">Modifier mon profil</h2>
                <span className="text-[10px] bg-secondary text-foreground px-2 py-0.5 rounded-full font-medium border border-border">
                  {userRole}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Gérez vos informations professionnelles et personnelles</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-foreground">Modifications enregistrées !</p>
            <p className="text-muted-foreground text-[11px]">Votre profil a été mis à jour avec succès en base de données.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Champs en lecture seule (Matricule & Email institutionnel) */}
            <div className="bg-secondary/50 p-3 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Identifiants institutionnels (Vérifiés UM6P)</span>
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Lecture seule
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-muted-foreground">Matricule :</span>
                  <span className="ml-1 font-mono font-semibold text-foreground">
                    {employeeId}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email :</span>
                  <span className="ml-1 font-medium text-foreground truncate block sm:inline">
                    {userEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Prénom & Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Prénom</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full bg-secondary/70 border border-border rounded-xl px-3 py-2 text-foreground focus:bg-card focus:border-primary focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full bg-secondary/70 border border-border rounded-xl px-3 py-2 text-foreground focus:bg-card focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Intitulé de Poste / Fonction */}
            <div>
              <label className="block font-semibold text-foreground mb-1">Fonction / Poste</label>
              <div className="relative">
                <input
                  type="text"
                  disabled={isTrainer}
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  className={`w-full border rounded-xl pl-8 pr-3 py-2 text-foreground transition-all ${
                    isTrainer 
                      ? "bg-secondary/40 border-border text-muted-foreground cursor-not-allowed" 
                      : "bg-secondary/70 border-border focus:bg-card focus:border-primary focus:outline-none"
                  }`}
                />
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              {isTrainer && (
                <span className="text-[10px] text-muted-foreground mt-1 block">Attribué par les Ressources Humaines</span>
              )}
            </div>

            {/* Centre de rattachement & Spécialité */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Centre de rattachement</label>
                {isTrainer ? (
                  <input
                    type="text"
                    disabled
                    value={formData.home_center_id === 2 ? "Safi" : formData.home_center_id === 3 ? "Jorf Lasfar" : formData.home_center_id === 4 ? "Khouribga" : "Ben Guerir Campus (AaiT)"}
                    className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-muted-foreground cursor-not-allowed text-xs"
                  />
                ) : (
                  <select
                    value={formData.home_center_id}
                    onChange={(e) => setFormData({ ...formData, home_center_id: Number(e.target.value) })}
                    className="w-full bg-secondary/70 border border-border rounded-xl px-2.5 py-2 text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value={1} className="bg-card text-foreground">Ben Guerir (AaiT)</option>
                    <option value={2} className="bg-card text-foreground">Safi</option>
                    <option value={3} className="bg-card text-foreground">Jorf Lasfar</option>
                    <option value={4} className="bg-card text-foreground">Khouribga</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Domaine / Spécialité</label>
                {isTrainer ? (
                  <input
                    type="text"
                    disabled
                    value={formData.specialty_id === 1 ? "Digital & Data" : formData.specialty_id === 2 ? "HSE & Sécurité" : formData.specialty_id === 3 ? "Maintenance" : "Procédés"}
                    className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-muted-foreground cursor-not-allowed text-xs"
                  />
                ) : (
                  <select
                    value={formData.specialty_id}
                    onChange={(e) => setFormData({ ...formData, specialty_id: Number(e.target.value) })}
                    className="w-full bg-secondary/70 border border-border rounded-xl px-2.5 py-2 text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value={1} className="bg-card text-foreground">Digital & Data</option>
                    <option value={2} className="bg-card text-foreground">HSE & Sécurité</option>
                    <option value={3} className="bg-card text-foreground">Maintenance Industrielle</option>
                    <option value={4} className="bg-card text-foreground">Chimie et procédés</option>
                    <option value={5} className="bg-card text-foreground">Industrie minière</option>
                  </select>
                )}
              </div>
            </div>

            {/* Téléphone & Bio */}
            <div>
              <label className="block font-semibold text-foreground mb-1">Numéro de Téléphone</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+212 6 00 00 00 00"
                  className="w-full bg-secondary/70 border border-border rounded-xl pl-8 pr-3 py-2 text-foreground focus:bg-card focus:border-primary focus:outline-none"
                />
                <Phone className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Biographie / Note personnelle</label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Quelques mots sur vos activités ou expertises..."
                className="w-full bg-secondary/70 border border-border rounded-xl px-3 py-2 text-foreground focus:bg-card focus:border-primary focus:outline-none text-xs resize-none"
              />
            </div>

            {/* Boutons d'actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer active:scale-[0.99]"
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
