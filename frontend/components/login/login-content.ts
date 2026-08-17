import type { Lang } from '@/lib/i18n'

export interface LoginCopy {
  brandTag: string
  welcomeTitle: string
  welcomeBody: string
  highlights: string[]
  formTitle: string
  formSubtitle: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  submit: string
  demoDivider: string
  demoManager: string
  demoManagerHint: string
  demoPlanner: string
  demoPlannerHint: string
  backToHome: string
  demoNotice: string
}

export const loginContent: Record<Lang, LoginCopy> = {
  fr: {
    brandTag: 'UM6P TechniX',
    welcomeTitle: "Pilotage de la capacité d'animation",
    welcomeBody:
      "Suivi de la charge des formateurs, planification des sessions et rééquilibrage de l'activité sur les 4 centres du réseau.",
    highlights: [
      'Indicateurs de capacité consolidés',
      'Affectation des formateurs par centre et domaine',
      'Neutralisation automatique des jours fériés',
    ],
    formTitle: 'Connexion',
    formSubtitle: 'Accédez à votre espace de pilotage.',
    emailLabel: 'Adresse e-mail professionnelle',
    emailPlaceholder: 'prenom.nom@um6p.ma',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: '••••••••',
    submit: 'Se connecter',
    demoDivider: 'Accès rapide démonstration',
    demoManager: 'Connexion Manager',
    demoManagerHint: 'Tableau de bord & indicateurs',
    demoPlanner: 'Connexion Planificateur',
    demoPlannerHint: 'Planning & affectations',
    backToHome: "← Retour à l'accueil",
    demoNotice: 'Plateforme sécurisée — Connectez-vous avec vos identifiants UM6P / OCP.',
  },
  en: {
    brandTag: 'UM6P TechniX',
    welcomeTitle: 'Trainer capacity steering',
    welcomeBody:
      'Track trainer workload, schedule sessions and rebalance activity across the 4 network centers.',
    highlights: [
      'Consolidated capacity indicators',
      'Trainer assignment by center and domain',
      'Automatic public holiday neutralization',
    ],
    formTitle: 'Sign in',
    formSubtitle: 'Access your steering workspace.',
    emailLabel: 'Work email address',
    emailPlaceholder: 'first.last@um6p.ma',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    submit: 'Sign in',
    demoDivider: 'Demo quick access',
    demoManager: 'Manager Sign-in',
    demoManagerHint: 'Dashboard & indicators',
    demoPlanner: 'Planner Sign-in',
    demoPlannerHint: 'Planning & assignments',
    backToHome: '← Back to home',
    demoNotice: 'Secured platform — Sign in with your UM6P / OCP credentials.',
  },
}
