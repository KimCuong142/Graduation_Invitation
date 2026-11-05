import { InvitationData } from '../types/invitation';

export const defaultInvitationData: InvitationData = {
  // Graduate Profile
  graduateName: 'Huynh Kim Cuong',
  degreeName: 'Bachelor of',
  majorName: 'Information Technology',
  facultyName: 'Faculty of Information Technology',
  universityName: 'FPT University',
  classCohort: 'Class of 2022 - 2026',
  academicYears: '2022 - 2026',
  portraitUrl: '/assets/graduate-portrait-sculpture.png',
  portraitCaption: 'Self Made Man · Bobbie Carlyle, 1983',

  // Recipient
  recipientTitle: 'You are cordially invited:',
  recipientName: 'Nguyễn Ngọc Thảo',
  invitationMessage: 'Please join me at the Graduation Ceremony to share the joy and mark an important milestone in my academic journey.',

  // Ceremony Event & Schedule
  eventTitle: 'GRADUATION CEREMONY',
  eventDateText: 'Saturday, June 27, 2026',
  eventIsoDate: '2026-06-27T07:30:00+07:00',
  schedule: [
    {
      time: '07:30 - 08:30',
      title: 'Reception & Photos',
      description: 'Đón tiếp khách quý và chụp ảnh lưu niệm tại sảnh chính'
    },
    {
      time: '08:30 - 10:30',
      title: 'Main Ceremony',
      description: 'Nghi thức trao bằng tốt nghiệp trang trọng tại khán phòng'
    }
  ],

  // Venue
  venueName: 'Grand Convention Hall',
  venueRoom: 'Main Auditorium, Building Alpha',
  venueAddress: 'FPT University, D1 High-Tech Park, Long Thanh My, Thu Duc City, HCMC',
  googleMapsUrl: 'https://maps.google.com/?q=FPT+University+HCMC',

  // Diamond Evaluation & Report
  diamondReportTitle: 'DIAMOND REPORT',
  diamondImage: '/assets/diamond-sparkle-emblem.png',
  diamondGrading: {
    cutGrade: 'Excellent',
    colorGrade: 'D',
    clarityGrade: 'VVS1',
    caratWeight: '0.82 ct',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    cutStyle: 'Round Brilliant',
    tableSize: '57%',
    crownAngle: '34.5°',
    pavilionAngle: '40.8°',
    totalDepth: '61.5%',
    girdle: 'Medium to Slightly Thick'
  },
  inspirationalQuote: 'Graduation is not the end, but the beginning of a greater journey.',
  quoteAuthor: 'Class of 2022 - 2026',

  // Contact & Closing
  thankYouMessage: 'THANK YOU FOR BEING A PART OF THIS SPECIAL MOMENT.',
  contactEmail: 'cuonghk@fpt.edu.vn',
  contactPhone: '+84 (0) 90 123 4567',
  websiteUrl: 'https://fpt.edu.vn',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://maps.google.com/?q=FPT+University+HCMC&margin=6'
};

