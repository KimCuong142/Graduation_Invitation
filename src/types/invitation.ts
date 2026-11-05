export interface DiamondGrading {
  cutGrade: string;      // e.g. "Excellent"
  colorGrade: string;    // e.g. "D"
  clarityGrade: string;  // e.g. "VVS1"
  caratWeight: string;   // e.g. "0.82 ct"
  polish: string;        // e.g. "Excellent"
  symmetry: string;      // e.g. "Excellent"
  fluorescence: string;  // e.g. "None"
  cutStyle: string;      // e.g. "Round Brilliant"
  // Proportions
  tableSize?: string;    // e.g. "57%"
  crownAngle?: string;   // e.g. "34.5°"
  pavilionAngle?: string;// e.g. "40.8°"
  totalDepth?: string;   // e.g. "61.5%"
  girdle?: string;       // e.g. "Medium to Slightly Thick"
}

export interface ScheduleEvent {
  time: string;
  title: string;
  description?: string;
}

export interface InvitationData {
  // Graduate Profile
  graduateName: string;
  degreeName: string;
  majorName: string;
  facultyName: string;
  universityName: string;
  classCohort: string;
  academicYears: string;
  portraitUrl: string;
  portraitCaption?: string;

  // Recipient
  recipientTitle?: string;
  recipientName: string;
  invitationMessage: string;

  // Ceremony Event & Schedule
  eventTitle: string;
  eventDateText: string;
  eventIsoDate?: string;
  schedule: ScheduleEvent[];

  // Venue
  venueName: string;
  venueRoom?: string;
  venueAddress: string;
  googleMapsUrl: string;

  // Diamond Evaluation & Report
  diamondReportTitle: string;
  diamondImage?: string;
  diamondGrading: DiamondGrading;
  inspirationalQuote: string;
  quoteAuthor?: string;

  // Contact & Closing
  thankYouMessage: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl?: string;
  qrCodeUrl?: string;
}

export type InvitationViewMode = 
  | 'brochure'        // Realistic tactile Tri-fold Brochure using original designs (1 -> 2 & 5 -> 2, 3, 4)
  | '3d-fold'         // Interactive 3D folding card
  | 'inside-spread'   // 3-panel panoramic spread (Inside Left, Center, Right)
  | 'front-cover'     // Front Cover only
  | 'back-cover'      // Back Cover only
  | 'all-panels';     // All 5 panels overview (print / inspection)

