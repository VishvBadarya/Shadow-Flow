import type {
  Doctor,
  Department,
  MedicalService,
  HealthPackage,
  Appointment,
  MedicalRecord,
  Prescription,
  LabReport,
  BillInvoice,
  HealthArticle,
  Testimonial,
  UserProfile,
  AppNotification
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'p-101',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@example.com',
  role: 'patient',
  phone: '+1 (555) 234-5678',
  age: 34,
  gender: 'Female',
  bloodGroup: 'A positive (A+)',
  emergencyContact: 'David Jenkins (Spouse) - +1 (555) 876-5432',
  allergies: ['Penicillin', 'Sulfa drugs'],
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
};

export const DEMO_USERS: Record<'patient' | 'doctor' | 'admin', UserProfile> = {
  patient: {
    id: 'p-101',
    name: 'Sarah Jenkins',
    email: 'patient@shadowflow.health',
    role: 'patient',
    phone: '+1 (555) 234-5678',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    emergencyContact: 'David Jenkins (Spouse) - +1 (555) 876-5432',
    allergies: ['Penicillin', 'Sulfa drugs'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
  },
  doctor: {
    id: 'doc-1',
    name: 'Dr. Marcus Vance, MD',
    email: 'doctor@shadowflow.health',
    role: 'doctor',
    phone: '+1 (555) 432-1098',
    specialty: 'Cardiology',
    department: 'Cardiology & Cardiovascular Surgery',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80'
  },
  admin: {
    id: 'adm-01',
    name: 'Eleanor Sterling',
    email: 'admin@shadowflow.health',
    role: 'admin',
    phone: '+1 (555) 999-0011',
    department: 'Hospital Administration & Clinical Operations',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
  }
};

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Marcus Vance, MD, FACC',
    specialty: 'Cardiology',
    qualification: 'MD, DM (Cardiology), Harvard Medical School',
    experience: 16,
    rating: 4.95,
    reviewsCount: 284,
    consultationFee: 150,
    nextAvailable: 'Today at 02:30 PM',
    availableToday: true,
    online: true,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    hospitalDepartment: 'Cardiology',
    languages: ['English', 'Spanish', 'German'],
    gender: 'Male',
    consultationType: ['In-Person', 'Video Consultation'],
    about: 'Dr. Marcus Vance is the Senior Director of Cardiovascular Sciences at ShadowFlow MediCare Nexus. With over 16 years of clinical excellence, he specializes in interventional cardiology, transcatheter aortic valve replacement (TAVR), and complex coronary interventions.',
    education: [
      { degree: 'Fellowship in Interventional Cardiology', institution: 'Brigham and Women’s Hospital, Boston', year: '2012' },
      { degree: 'Residency in Internal Medicine', institution: 'Johns Hopkins Hospital', year: '2009' },
      { degree: 'Doctor of Medicine (MD)', institution: 'Harvard Medical School', year: '2006' }
    ],
    experienceList: [
      { role: 'Chief of Interventional Cardiology', hospital: 'ShadowFlow MediCare Nexus', duration: '2018 - Present' },
      { role: 'Associate Professor of Cardiology', hospital: 'Metro General Medical Center', duration: '2013 - 2018' },
      { role: 'Attending Cardiologist', hospital: 'Boston Central Hospital', duration: '2010 - 2013' }
    ],
    availableSlots: [
      { date: '2026-10-01', slots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'] },
      { date: '2026-10-02', slots: ['10:00 AM', '01:30 PM', '03:15 PM'] },
      { date: '2026-10-03', slots: ['09:00 AM', '11:30 AM', '02:00 PM', '05:00 PM'] }
    ]
  },
  {
    id: 'doc-2',
    name: 'Dr. Elena Rostova, MD, PhD',
    specialty: 'Neurology',
    qualification: 'MD, PhD (Neuroscience), Johns Hopkins University',
    experience: 14,
    rating: 4.92,
    reviewsCount: 198,
    consultationFee: 165,
    nextAvailable: 'Tomorrow at 10:00 AM',
    availableToday: false,
    online: true,
    image: 'https://images.unsplash.com/photo-1594824813576-92850906baee?auto=format&fit=crop&w=600&q=80',
    hospitalDepartment: 'Neurology',
    languages: ['English', 'Russian', 'French'],
    gender: 'Female',
    consultationType: ['In-Person', 'Video Consultation'],
    about: 'Dr. Elena Rostova is an acclaimed neuroscientist and neurologist focusing on stroke mitigation, neurodegenerative disease management, multiple sclerosis, and advanced neuromodulation therapy.',
    education: [
      { degree: 'Fellowship in Neuro-immunology', institution: 'Johns Hopkins Hospital', year: '2014' },
      { degree: 'PhD in Cognitive Neuroscience', institution: 'Oxford University', year: '2011' },
      { degree: 'MD', institution: 'Johns Hopkins School of Medicine', year: '2008' }
    ],
    experienceList: [
      { role: 'Head of Neuro-Critical Care', hospital: 'ShadowFlow MediCare Nexus', duration: '2019 - Present' },
      { role: 'Consultant Neurologist', hospital: 'St. Jude Neurological Institute', duration: '2014 - 2019' }
    ],
    availableSlots: [
      { date: '2026-10-01', slots: ['10:00 AM', '11:45 AM', '03:00 PM'] },
      { date: '2026-10-02', slots: ['09:15 AM', '02:00 PM', '04:30 PM'] }
    ]
  },
  {
    id: 'doc-3',
    name: 'Dr. Julian Thorne, MS, FRCS',
    specialty: 'Orthopedics',
    qualification: 'MS (Orthopedics), FRCS (Tr & Orth), Royal College of Surgeons',
    experience: 18,
    rating: 4.89,
    reviewsCount: 312,
    consultationFee: 140,
    nextAvailable: 'Today at 04:15 PM',
    availableToday: true,
    online: false,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    hospitalDepartment: 'Orthopedics',
    languages: ['English'],
    gender: 'Male',
    consultationType: ['In-Person'],
    about: 'Dr. Julian Thorne is a pioneer in computer-navigated robotic joint reconstruction and sports arthroscopy. He has executed over 3,200 successful robotic knee and hip replacements.',
    education: [
      { degree: 'FRCS Trauma & Orthopedic Surgery', institution: 'Royal College of Surgeons of Edinburgh', year: '2009' },
      { degree: 'MS in Orthopedic Surgery', institution: 'Imperial College London', year: '2006' }
    ],
    experienceList: [
      { role: 'Director of Robotic Joint Replacement', hospital: 'ShadowFlow MediCare Nexus', duration: '2017 - Present' },
      { role: 'Lead Orthopedic Consultant', hospital: 'London Orthopedic Center', duration: '2010 - 2017' }
    ],
    availableSlots: [
      { date: '2026-10-01', slots: ['04:15 PM', '05:30 PM'] },
      { date: '2026-10-02', slots: ['09:00 AM', '11:00 AM', '01:30 PM'] }
    ]
  },
  {
    id: 'doc-4',
    name: 'Dr. Priya Nair, MD, FAAP',
    specialty: 'Pediatrics',
    qualification: 'MD (Pediatrics), Stanford University School of Medicine',
    experience: 12,
    rating: 4.97,
    reviewsCount: 420,
    consultationFee: 110,
    nextAvailable: 'Today at 03:00 PM',
    availableToday: true,
    online: true,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    hospitalDepartment: 'Pediatrics',
    languages: ['English', 'Hindi', 'Malayalam'],
    gender: 'Female',
    consultationType: ['In-Person', 'Video Consultation'],
    about: 'Dr. Priya Nair is deeply loved by our younger patients and parents. Her clinical focus ranges from neonatal intensive care to adolescent developmental psychology and pediatric allergy management.',
    education: [
      { degree: 'Fellowship in Pediatric Critical Care', institution: 'Stanford Children’s Health', year: '2016' },
      { degree: 'Residency in Pediatrics', institution: 'UCSF Medical Center', year: '2014' },
      { degree: 'MD', institution: 'Stanford University', year: '2011' }
    ],
    experienceList: [
      { role: 'Chief of Pediatric Medicine', hospital: 'ShadowFlow MediCare Nexus', duration: '2020 - Present' },
      { role: 'Pediatric Consultant', hospital: 'Bay Area Children’s Clinic', duration: '2015 - 2020' }
    ],
    availableSlots: [
      { date: '2026-10-01', slots: ['03:00 PM', '04:30 PM', '05:15 PM'] },
      { date: '2026-10-02', slots: ['09:30 AM', '11:15 AM', '02:00 PM'] }
    ]
  },
  {
    id: 'doc-5',
    name: 'Dr. Chloe Bennett, MD, FAAD',
    specialty: 'Dermatology',
    qualification: 'MD, Board Certified Dermatologist, Columbia University',
    experience: 11,
    rating: 4.88,
    reviewsCount: 165,
    consultationFee: 125,
    nextAvailable: 'Tomorrow at 11:30 AM',
    availableToday: false,
    online: true,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
    hospitalDepartment: 'Dermatology',
    languages: ['English', 'French'],
    gender: 'Female',
    consultationType: ['In-Person', 'Video Consultation'],
    about: 'Specializing in medical dermatology, Mohs micrographic surgery, cutaneous oncology, and advanced laser therapeutics for chronic inflammatory skin disorders.',
    education: [
      { degree: 'Fellowship in Dermatologic Oncology', institution: 'Memorial Sloan Kettering', year: '2016' },
      { degree: 'MD', institution: 'Columbia University Vagelos College', year: '2013' }
    ],
    experienceList: [
      { role: 'Senior Consultant Dermatologist', hospital: 'ShadowFlow MediCare Nexus', duration: '2021 - Present' },
      { role: 'Dermatology Attending', hospital: 'New York Presbyterian', duration: '2016 - 2021' }
    ],
    availableSlots: [
      { date: '2026-10-02', slots: ['11:30 AM', '01:00 PM', '03:30 PM'] },
      { date: '2026-10-03', slots: ['10:00 AM', '02:30 PM'] }
    ]
  },
  {
    id: 'doc-6',
    name: 'Dr. Arthur Pendelton, MD, DM',
    specialty: 'Oncology',
    qualification: 'MD, DM (Medical Oncology), MD Anderson Cancer Center',
    experience: 22,
    rating: 4.96,
    reviewsCount: 240,
    consultationFee: 180,
    nextAvailable: 'Friday at 01:00 PM',
    availableToday: false,
    online: false,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    hospitalDepartment: 'Oncology',
    languages: ['English'],
    gender: 'Male',
    consultationType: ['In-Person'],
    about: 'World-renowned medical oncologist and researcher in precision immunotherapy and genomic cancer markers. Chair of the Comprehensive Tumor Board at MediCare Nexus.',
    education: [
      { degree: 'Fellowship in Precision Immunotherapy', institution: 'MD Anderson Cancer Center', year: '2006' },
      { degree: 'MD', institution: 'Yale School of Medicine', year: '2001' }
    ],
    experienceList: [
      { role: 'Chair of Comprehensive Oncology', hospital: 'ShadowFlow MediCare Nexus', duration: '2016 - Present' },
      { role: 'Professor of Clinical Oncology', hospital: 'Houston Medical Institute', duration: '2007 - 2016' }
    ],
    availableSlots: [
      { date: '2026-10-03', slots: ['01:00 PM', '02:45 PM', '04:15 PM'] }
    ]
  },
  {
    id: 'doc-7',
    name: 'Dr. Maria Santos, MD, FACOG',
    specialty: 'Gynecology',
    qualification: 'MD (OB-GYN), University of Pennsylvania',
    experience: 15,
    rating: 4.94,
    reviewsCount: 380,
    consultationFee: 135,
    nextAvailable: 'Today at 05:00 PM',
    availableToday: true,
    online: true,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    hospitalDepartment: 'Gynecology',
    languages: ['English', 'Spanish', 'Portuguese'],
    gender: 'Female',
    consultationType: ['In-Person', 'Video Consultation'],
    about: 'Dedicated to high-risk obstetrics, minimally invasive laparoscopic gynecological surgeries, reproductive endocrinology, and comprehensive women wellness.',
    education: [
      { degree: 'Fellowship in Maternal-Fetal Medicine', institution: 'Hospital of the University of Pennsylvania', year: '2013' },
      { degree: 'MD', institution: 'Perelman School of Medicine', year: '2010' }
    ],
    experienceList: [
      { role: 'Head of Maternal-Fetal Medicine', hospital: 'ShadowFlow MediCare Nexus', duration: '2018 - Present' },
      { role: 'Attending Obstetrician', hospital: 'Philadelphia Women’s Center', duration: '2013 - 2018' }
    ],
    availableSlots: [
      { date: '2026-10-01', slots: ['05:00 PM', '06:00 PM'] },
      { date: '2026-10-02', slots: ['10:00 AM', '12:00 PM', '03:00 PM'] }
    ]
  },
  {
    id: 'doc-8',
    name: 'Dr. Tariq Al-Mansoor, MD, FACP',
    specialty: 'General Medicine',
    qualification: 'MD, FACP (Internal Medicine), Mayo Clinic College of Medicine',
    experience: 19,
    rating: 4.91,
    reviewsCount: 512,
    consultationFee: 100,
    nextAvailable: 'Today at 01:15 PM',
    availableToday: true,
    online: true,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
    hospitalDepartment: 'General Medicine',
    languages: ['English', 'Arabic'],
    gender: 'Male',
    consultationType: ['In-Person', 'Video Consultation'],
    about: 'Expert internal medicine diagnostician with broad expertise in multi-system chronic metabolic diseases, hypertension management, preventive healthcare, and elderly care.',
    education: [
      { degree: 'Residency in Internal Medicine', institution: 'Mayo Clinic Rochester', year: '2008' },
      { degree: 'MD', institution: 'Mayo Clinic Alix School of Medicine', year: '2005' }
    ],
    experienceList: [
      { role: 'Head of Internal Medicine & Preventive Care', hospital: 'ShadowFlow MediCare Nexus', duration: '2015 - Present' },
      { role: 'Consultant Internist', hospital: 'Midwest Regional Health', duration: '2008 - 2015' }
    ],
    availableSlots: [
      { date: '2026-10-01', slots: ['01:15 PM', '02:45 PM', '04:30 PM'] },
      { date: '2026-10-02', slots: ['08:30 AM', '11:00 AM', '02:15 PM'] }
    ]
  }
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    iconName: 'HeartPulse',
    shortDesc: 'Comprehensive cardiovascular diagnosis, cath labs, coronary interventions, and heart surgery.',
    longDesc: 'The Department of Cardiology & Cardiac Surgery at ShadowFlow MediCare Nexus is equipped with dual biplane catheterization laboratories, hybrid operating suites, and a dedicated 24-bed Coronary Care Unit (CCU). We handle everything from emergent myocardial infarction interventions to robotic valve replacements.',
    headOfDept: 'Dr. Marcus Vance, MD, FACC',
    bedCapacity: 64,
    surgeriesCompleted: 4850,
    doctorsCount: 18,
    keyProcedures: ['Transcatheter Aortic Valve Replacement (TAVR)', 'Coronary Angioplasty & Stenting', 'Electrophysiology Studies & Ablation', 'CABG Bypass Surgery'],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    iconName: 'Brain',
    shortDesc: 'Advanced neuro-critical care, stroke code protocol, epilepsy monitoring, and spine surgery.',
    longDesc: 'Our Comprehensive Stroke Center provides 24/7 hyper-acute mechanical thrombectomy, continuous 32-channel EEG monitoring, and minimally invasive robotic neurosurgery for intracranial aneurysms and skull-base tumors.',
    headOfDept: 'Dr. Elena Rostova, MD, PhD',
    bedCapacity: 48,
    surgeriesCompleted: 2150,
    doctorsCount: 14,
    keyProcedures: ['Endovascular Thrombectomy for Acute Stroke', 'Deep Brain Stimulation (DBS)', 'Complex Spinal Micro-Decompression', 'Stereotactic Radiosurgery'],
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    iconName: 'Bone',
    shortDesc: 'Robotic joint replacements, sports medicine, spine trauma, and musculoskeletal rehab.',
    longDesc: 'Utilizing Mako® robotic-arm assisted surgical systems, our orthopedic surgeons achieve sub-millimeter precision in partial and total joint replacements, resulting in 50% faster post-operative mobilization and reduced recovery times.',
    headOfDept: 'Dr. Julian Thorne, MS, FRCS',
    bedCapacity: 52,
    surgeriesCompleted: 5600,
    doctorsCount: 16,
    keyProcedures: ['Robotic Total Knee Replacement', 'Anterior Approach Hip Arthroplasty', 'ACL & Meniscal Reconstruction', 'Complex Pelvic Fracture Fixation'],
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    iconName: 'Baby',
    shortDesc: 'Level IV NICU, pediatric surgery, developmental assessments, and child wellness.',
    longDesc: 'Providing compassionate care for infants, children, and adolescents. Our Level IV Neonatal Intensive Care Unit is backed by 24/7 dedicated neonatologists, ECMO support, and child-life specialists in a nurturing, family-centered space.',
    headOfDept: 'Dr. Priya Nair, MD, FAAP',
    bedCapacity: 40,
    surgeriesCompleted: 1900,
    doctorsCount: 15,
    keyProcedures: ['Neonatal Surgical Correction', 'Pediatric Bronchoscopy', 'Allergy Desensitization Protocols', 'Childhood Neuro-Developmental Support'],
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    iconName: 'Sparkles',
    shortDesc: 'Clinical dermatology, skin oncology, Mohs micrographic surgery, and aesthetic lasers.',
    longDesc: 'Comprehensive diagnostics for melanoma, psoriasis, atopic dermatitis, and autoimmune blistering conditions. Our state-of-the-art laser suite treats vascular anomalies, scars, and pigmentation with clinical efficacy.',
    headOfDept: 'Dr. Chloe Bennett, MD, FAAD',
    bedCapacity: 16,
    surgeriesCompleted: 1250,
    doctorsCount: 9,
    keyProcedures: ['Mohs Micrographic Cancer Surgery', 'Photodynamic Therapy (PDT)', 'Excimer Laser for Psoriasis', 'Digital Dermoscopy Body Mapping'],
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'oncology',
    name: 'Oncology',
    iconName: 'ShieldAlert',
    shortDesc: 'Targeted immunotherapy, precision genomic medicine, LINAC radiotherapy, and tumor board.',
    longDesc: 'Our Comprehensive Cancer Institute is accredited for cutting-edge targeted chemotherapy, CAR-T cell infusions, robotic surgical oncology, and TrueBeam stereotactic body radiation therapy (SBRT) with customized genetic profiling.',
    headOfDept: 'Dr. Arthur Pendelton, MD, DM',
    bedCapacity: 60,
    surgeriesCompleted: 3400,
    doctorsCount: 20,
    keyProcedures: ['Next-Gen Tumor Genomic Sequencing', 'Targeted Immunotherapy Infusion', 'Stereotactic Body Radiotherapy (SBRT)', 'Hyperthermic Intraperitoneal Chemotherapy (HIPEC)'],
    image: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gynecology',
    name: 'Gynecology',
    iconName: 'HeartHandshake',
    shortDesc: 'High-risk maternity care, prenatal genetics, laparoscopic surgery, and fertility solutions.',
    longDesc: 'Featuring private luxury birthing suites, advanced 4D fetal echocardiography, and minimally invasive robotic hysterectomy and myomectomy solutions that allow same-day discharge for over 80% of surgical patients.',
    headOfDept: 'Dr. Maria Santos, MD, FACOG',
    bedCapacity: 45,
    surgeriesCompleted: 3900,
    doctorsCount: 14,
    keyProcedures: ['Single-Incision Laparoscopic Hysterectomy', 'High-Risk Maternal-Fetal Surveillance', 'Hysteroscopic Myomectomy', 'Fetal Echocardiogram & Karyotyping'],
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    iconName: 'Stethoscope',
    shortDesc: 'Primary healthcare, lifestyle disease management, diagnostic workups, and geriatrics.',
    longDesc: 'The central gateway of MediCare Nexus. Our dedicated internists deliver personalized preventative risk stratifications, systemic infectious disease management, diabetes reversal protocols, and multi-specialty coordination.',
    headOfDept: 'Dr. Tariq Al-Mansoor, MD, FACP',
    bedCapacity: 75,
    surgeriesCompleted: 1100,
    doctorsCount: 22,
    keyProcedures: ['Comprehensive Metabolic Health Screening', 'Hypertension & Lipid Risk Stratification', 'Adult Immunization Schedules', 'Post-Acute Multi-Organ Rehabilitation'],
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'
  }
];

export const SERVICES: MedicalService[] = [
  {
    id: 'srv-1',
    title: '24/7 Level-1 Emergency & Trauma Care',
    category: 'Emergency',
    description: 'Rapid triage with dedicated resuscitation bays, immediate trauma surgeons, and acute stroke code activation.',
    iconName: 'Ambulance',
    features: ['Direct Helipad access', 'Dedicated trauma CT in triage', 'Immediate OR transfer within 12 minutes'],
    turnaroundTime: 'Immediate (< 3 mins)',
    operatingHours: '24 Hours / 7 Days / 365 Days'
  },
  {
    id: 'srv-2',
    title: 'Robotic & Minimally Invasive Surgery',
    category: 'Surgical',
    description: 'Next-generation da Vinci® Xi robotic suites offering sub-millimeter precision, minimal bleeding, and rapid discharge.',
    iconName: 'Crosshair',
    features: ['3D High-Definition magnification', 'EndoWrist articulation', 'Less scarring & faster return to daily activity'],
    turnaroundTime: 'Elective & Urgent scheduling',
    operatingHours: '07:00 AM - 09:00 PM'
  },
  {
    id: 'srv-3',
    title: 'Advanced Diagnostic Imaging & Pathology',
    category: 'Diagnostics',
    description: 'Ultra-silent 3.0T MRI, 128-slice dual-energy spectral CT, automated laboratory track system.',
    iconName: 'ScanLine',
    features: ['Same-day verified digital reports', 'AI-assisted chest and neuro anomaly screening', 'Patient portal instant sync'],
    turnaroundTime: 'Routine: 2-4 hrs | Stat: 45 mins',
    operatingHours: '24/7 Inpatient & Outpatient'
  },
  {
    id: 'srv-4',
    title: 'Cardiovascular Cath Lab & CCU',
    category: 'Cardiology',
    description: 'Door-to-balloon time under 45 minutes for acute myocardial infarction, with bi-plane fluoroscopy.',
    iconName: 'Activity',
    features: ['TAVR & MitraClip capabilities', 'Radial artery priority access', 'Intravascular ultrasound (IVUS) guidance'],
    turnaroundTime: '24/7 On-call emergency cath team',
    operatingHours: '24 Hours'
  },
  {
    id: 'srv-5',
    title: 'Critical Care & Multi-Disciplinary ICU',
    category: 'Inpatient',
    description: '48 isolation-capable ICU suites with HEPA filtration, dedicated Intensivists, and continuous telemetry monitoring.',
    iconName: 'Layers',
    features: ['1:1 nurse-to-patient critical ratio', 'Extracorporeal Membrane Oxygenation (ECMO)', 'Closed-loop smart infusion systems'],
    turnaroundTime: 'Continuous 24/7 coverage',
    operatingHours: '24 Hours'
  },
  {
    id: 'srv-6',
    title: 'Telehealth & Digital Outpatient Consultations',
    category: 'Virtual Care',
    description: 'Secure HIPAA-compliant HD video consultations with top specialists, instant e-prescriptions, and vital tracking.',
    iconName: 'Video',
    features: ['Integrated medical record sharing', 'Direct pharmacy fulfillment', 'Digital appointment reminders'],
    turnaroundTime: 'On-demand or scheduled within 15 mins',
    operatingHours: '08:00 AM - 10:00 PM'
  }
];

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: 'pkg-1',
    name: 'Executive Comprehensive Health Check',
    targetGroup: 'Busy Professionals (Age 25-50)',
    price: 299,
    originalPrice: 480,
    testsCount: 78,
    popular: true,
    description: 'Complete multi-system assessment designed to identify silent metabolic, cardiac, liver, and kidney dysfunctions early.',
    features: [
      'Complete Hemogram & ESR (24 parameters)',
      'Advanced Lipid Profile (Direct LDL, ApoA, ApoB)',
      'Comprehensive Metabolic & Liver Function Panel',
      'High-Resolution Ultrasound Abdomen & Pelvis',
      'Resting 12-Lead ECG & Treadmill Test (TMT)',
      'HbA1c & Fasting Insulin with HOMA-IR',
      '1-on-1 Consultation with Senior Physician'
    ]
  },
  {
    id: 'pkg-2',
    name: 'Cardiac Shield & Vascular Screening',
    targetGroup: 'High Risk / Family History (Age 35+)',
    price: 349,
    originalPrice: 520,
    testsCount: 42,
    popular: false,
    description: 'Specialized diagnostic workup evaluating coronary artery calcium score, structural heart health, and vascular elasticity.',
    features: [
      'Color Doppler 2D Echocardiogram',
      'CT Coronary Calcium Scoring (CAC Scan)',
      'High-Sensitivity C-Reactive Protein (hs-CRP)',
      'Lipoprotein(a) & Homocysteine Level',
      'Carotid Artery Intima-Media Thickness (CIMT)',
      'Detailed Cardiologist Evaluation & Risk Stratification'
    ]
  },
  {
    id: 'pkg-3',
    name: 'Women’s Wellness 360 & Hormonal Panel',
    targetGroup: 'Women (All Age Groups)',
    price: 279,
    originalPrice: 420,
    testsCount: 65,
    popular: false,
    description: 'Tailored diagnostics covering hormonal balance, bone density, breast health, and cervical cancer screening.',
    features: [
      'Digital Mammography / Breast Ultrasound',
      'Liquid-Based Cytology Pap Smear + HPV DNA',
      'Dual-Energy X-ray Absorptiometry (DEXA Bone Scan)',
      'Thyroid Panel (Free T3, Free T4, Ultrasensitive TSH)',
      'Vitamin D3 & Vitamin B12 assay',
      'Consultation with Senior Gynecologist'
    ]
  },
  {
    id: 'pkg-4',
    name: 'Senior Citizen Golden Years Care',
    targetGroup: 'Seniors (Age 60+)',
    price: 389,
    originalPrice: 600,
    testsCount: 85,
    popular: false,
    description: 'Comprehensive geriatric assessment addressing mobility, cognition, organ health, cardiac reserve, and bone density.',
    features: [
      'Full Body Ultrasound & Chest X-Ray',
      'Kidney & Liver Function Panels + Serum Electrolytes',
      'Comprehensive Audiometry & Ophthalmic Screening',
      'Glycemic Control & Diabetic Neuropathy Screen',
      'Prostate Specific Antigen (PSA) / Pelvic Screen',
      'Home Blood Collection & Concierge Report Delivery'
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-8402',
    patientId: 'p-101',
    patientName: 'Sarah Jenkins',
    patientPhone: '+1 (555) 234-5678',
    patientEmail: 'sarah.jenkins@example.com',
    doctorId: 'doc-1',
    doctorName: 'Dr. Marcus Vance, MD',
    doctorSpecialty: 'Cardiology',
    department: 'Cardiology',
    date: '2026-10-02',
    timeSlot: '11:00 AM',
    status: 'Confirmed',
    reason: 'Quarterly cardiac stress test follow-up & BP review',
    consultationType: 'In-Person',
    hospitalLocation: 'West Wing, 4th Floor - Room 408',
    createdAt: '2026-09-28',
    notes: 'Patient noted slight palpitations after strenuous stair climbing.'
  },
  {
    id: 'APT-7911',
    patientId: 'p-101',
    patientName: 'Sarah Jenkins',
    patientPhone: '+1 (555) 234-5678',
    patientEmail: 'sarah.jenkins@example.com',
    doctorId: 'doc-4',
    doctorName: 'Dr. Priya Nair, MD',
    doctorSpecialty: 'Pediatrics',
    department: 'Pediatrics',
    date: '2026-10-08',
    timeSlot: '03:00 PM',
    status: 'Confirmed',
    reason: 'Annual developmental milestones checkup for daughter (Chloe)',
    consultationType: 'In-Person',
    hospitalLocation: 'Children’s Pavilion, 2nd Floor',
    createdAt: '2026-09-29'
  },
  {
    id: 'APT-6204',
    patientId: 'p-101',
    patientName: 'Sarah Jenkins',
    patientPhone: '+1 (555) 234-5678',
    patientEmail: 'sarah.jenkins@example.com',
    doctorId: 'doc-8',
    doctorName: 'Dr. Tariq Al-Mansoor, MD',
    doctorSpecialty: 'General Medicine',
    department: 'General Medicine',
    date: '2026-08-15',
    timeSlot: '09:30 AM',
    status: 'Completed',
    reason: 'Comprehensive annual physical and lipid screening',
    consultationType: 'In-Person',
    hospitalLocation: 'Main Atrium, Suite 102',
    createdAt: '2026-08-01'
  },
  {
    id: 'APT-9104',
    patientId: 'p-102',
    patientName: 'Robert Vance Jr.',
    patientPhone: '+1 (555) 345-6789',
    patientEmail: 'rvance@domain.com',
    doctorId: 'doc-1',
    doctorName: 'Dr. Marcus Vance, MD',
    doctorSpecialty: 'Cardiology',
    department: 'Cardiology',
    date: '2026-10-01',
    timeSlot: '02:30 PM',
    status: 'Confirmed',
    reason: 'Pre-op PAC fitness clearance for upcoming hernia repair',
    consultationType: 'In-Person',
    hospitalLocation: 'West Wing, 4th Floor - Room 408',
    createdAt: '2026-09-30'
  },
  {
    id: 'APT-9105',
    patientId: 'p-103',
    patientName: 'Emily Watson',
    patientPhone: '+1 (555) 456-7890',
    patientEmail: 'emily.w@domain.com',
    doctorId: 'doc-2',
    doctorName: 'Dr. Elena Rostova, MD',
    doctorSpecialty: 'Neurology',
    department: 'Neurology',
    date: '2026-10-01',
    timeSlot: '10:00 AM',
    status: 'Pending',
    reason: 'Chronic migraine with visual aura refractory to sumatriptan',
    consultationType: 'Video Consultation',
    hospitalLocation: 'Telehealth Portal',
    createdAt: '2026-09-30'
  },
  {
    id: 'APT-9106',
    patientId: 'p-104',
    patientName: 'Michael Chang',
    patientPhone: '+1 (555) 567-8901',
    patientEmail: 'mchang@domain.com',
    doctorId: 'doc-3',
    doctorName: 'Dr. Julian Thorne, MS',
    doctorSpecialty: 'Orthopedics',
    department: 'Orthopedics',
    date: '2026-10-01',
    timeSlot: '04:15 PM',
    status: 'Confirmed',
    reason: 'Right knee post-arthroscopy check & range of motion review',
    consultationType: 'In-Person',
    hospitalLocation: 'North Wing, Ortho Suite 310',
    createdAt: '2026-09-29'
  }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'REC-2026-08',
    patientId: 'p-101',
    visitDate: '2026-08-15',
    doctorName: 'Dr. Tariq Al-Mansoor, MD',
    department: 'General Medicine',
    diagnosis: 'Borderline Hypercholesterolemia with Stage 1 Essential Hypertension',
    treatment: 'Lifestyle modification, Mediterranean dietary protocol, daily 30m aerobic exercise, initiated Low-dose Telmisartan 20mg once daily.',
    vitalSigns: {
      bp: '138/86 mmHg',
      pulse: '74 bpm',
      temp: '98.4 °F',
      weight: '64.5 kg'
    },
    attachments: [
      { name: 'Encounter_Summary_Aug15.pdf', size: '1.4 MB', type: 'PDF' },
      { name: 'ECG_Strip_12Lead.pdf', size: '840 KB', type: 'PDF' }
    ]
  },
  {
    id: 'REC-2026-04',
    patientId: 'p-101',
    visitDate: '2026-04-10',
    doctorName: 'Dr. Marcus Vance, MD',
    department: 'Cardiology',
    diagnosis: 'Mild Exercise-Induced Palpitations (Sinus Tachycardia, no arrhythmia)',
    treatment: 'Holter 48h monitoring performed showing 0 ectopic ventricular beats. Recommended reducing espresso intake and optimal hydration.',
    vitalSigns: {
      bp: '132/82 mmHg',
      pulse: '78 bpm',
      temp: '98.6 °F',
      weight: '65.0 kg'
    },
    attachments: [
      { name: '48Hr_Holter_Report_Final.pdf', size: '3.8 MB', type: 'PDF' }
    ]
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-9921',
    patientId: 'p-101',
    patientName: 'Sarah Jenkins',
    date: '2026-08-15',
    doctorName: 'Dr. Tariq Al-Mansoor, MD',
    department: 'General Medicine',
    diagnosis: 'Essential Hypertension (Stage 1)',
    medicines: [
      {
        name: 'Telmisartan Tablets',
        dosage: '20 mg',
        frequency: 'Once Daily (Morning with breakfast)',
        duration: '90 Days',
        instructions: 'Monitor sitting morning blood pressure once weekly.'
      },
      {
        name: 'Rosuvastatin Calcium',
        dosage: '5 mg',
        frequency: 'Once Daily (At Bedtime)',
        duration: '90 Days',
        instructions: 'Lipid panel re-check scheduled in 3 months.'
      },
      {
        name: 'Coenzyme Q10 Softgels',
        dosage: '100 mg',
        frequency: 'Once Daily',
        duration: '60 Days',
        instructions: 'Dietary antioxidant support.'
      }
    ]
  },
  {
    id: 'RX-8104',
    patientId: 'p-101',
    patientName: 'Sarah Jenkins',
    date: '2026-04-10',
    doctorName: 'Dr. Marcus Vance, MD',
    department: 'Cardiology',
    diagnosis: 'Mild Sinus Tachycardia',
    medicines: [
      {
        name: 'Magnesium Glycinate',
        dosage: '250 mg',
        frequency: 'Twice daily with water',
        duration: '30 Days',
        instructions: 'Electrolyte replenishment to soothe cardiac irritability.'
      }
    ]
  }
];

export const INITIAL_LAB_REPORTS: LabReport[] = [
  {
    id: 'LAB-5541',
    patientId: 'p-101',
    testName: 'Comprehensive Lipid & Apolipoprotein Panel',
    category: 'Biochemistry',
    date: '2026-08-14',
    doctorName: 'Dr. Tariq Al-Mansoor, MD',
    status: 'Completed',
    resultSummary: 'Total Cholesterol: 218 mg/dL (Elevated), LDL: 138 mg/dL (Elevated), HDL: 56 mg/dL (Normal), Triglycerides: 120 mg/dL (Optimal)',
    normalRange: 'LDL < 100 mg/dL',
    flag: 'Elevated'
  },
  {
    id: 'LAB-5542',
    patientId: 'p-101',
    testName: 'Complete Blood Count (CBC) with Differential',
    category: 'Hematology',
    date: '2026-08-14',
    doctorName: 'Dr. Tariq Al-Mansoor, MD',
    status: 'Completed',
    resultSummary: 'Hemoglobin: 13.8 g/dL, WBC: 6,400 /mcL, Platelets: 245,000 /mcL. All indices strictly within physiological reference ranges.',
    normalRange: 'Hb: 12.0 - 15.5 g/dL',
    flag: 'Normal'
  },
  {
    id: 'LAB-6209',
    patientId: 'p-101',
    testName: 'Thyroid Function Ultra-Sensitive Profile (FT3, FT4, TSH)',
    category: 'Endocrinology',
    date: '2026-09-28',
    doctorName: 'Dr. Marcus Vance, MD',
    status: 'Processing',
    resultSummary: 'Specimen collected at central pathology track; automated chemiluminescence assay in progress.',
    normalRange: 'TSH: 0.45 - 4.5 uIU/mL'
  },
  {
    id: 'LAB-6300',
    patientId: 'p-101',
    testName: 'High-Resolution 2D Echocardiogram with Strain Imaging',
    category: 'Cardiovascular Imaging',
    date: '2026-10-02',
    doctorName: 'Dr. Marcus Vance, MD',
    status: 'Pending',
    resultSummary: 'Scheduled for in-person acquisition at West Wing Imaging Bay 2 prior to 11:00 AM consultation.'
  }
];

export const INITIAL_BILLS: BillInvoice[] = [
  {
    id: 'INV-2026-1049',
    patientId: 'p-101',
    patientName: 'Sarah Jenkins',
    invoiceNumber: 'SF-INV-88201',
    date: '2026-09-28',
    dueDate: '2026-10-12',
    service: 'Outpatient Diagnostic & Pathology Workup',
    amount: 145.00,
    paidAmount: 0.00,
    status: 'Outstanding',
    items: [
      { description: 'Thyroid Ultra-Sensitive Chemiluminescence Panel', qty: 1, unitPrice: 75.00, total: 75.00 },
      { description: 'Venipuncture & Central Pathology Processing Fee', qty: 1, unitPrice: 20.00, total: 20.00 },
      { description: 'Pre-Cardiology Tele-Triage Record Review', qty: 1, unitPrice: 50.00, total: 50.00 }
    ]
  },
  {
    id: 'INV-2026-0814',
    patientId: 'p-101',
    patientName: 'Sarah Jenkins',
    invoiceNumber: 'SF-INV-79412',
    date: '2026-08-15',
    dueDate: '2026-08-15',
    service: 'General Internal Medicine Consultation & Lipid Panel',
    amount: 220.00,
    paidAmount: 220.00,
    status: 'Paid',
    items: [
      { description: 'Level 4 Comprehensive Internal Medicine Consultation', qty: 1, unitPrice: 100.00, total: 100.00 },
      { description: 'Comprehensive Automated Lipid & Apolipoprotein Panel', qty: 1, unitPrice: 85.00, total: 85.00 },
      { description: 'Resting 12-Lead Electrocardiogram (ECG)', qty: 1, unitPrice: 35.00, total: 35.00 }
    ]
  },
  {
    id: 'INV-2026-0410',
    patientId: 'p-101',
    patientName: 'Sarah Jenkins',
    invoiceNumber: 'SF-INV-61209',
    date: '2026-04-10',
    dueDate: '2026-04-10',
    service: 'Specialized Cardiology Consultation & 48h Holter Analysis',
    amount: 350.00,
    paidAmount: 350.00,
    status: 'Paid',
    items: [
      { description: 'Senior Director Cardiology Specialist Consultation', qty: 1, unitPrice: 150.00, total: 150.00 },
      { description: 'Continuous Digital 48-Hour Holter Telemetry Recording', qty: 1, unitPrice: 200.00, total: 200.00 }
    ]
  }
];

export const HEALTH_ARTICLES: HealthArticle[] = [
  {
    id: 'art-1',
    title: 'Recognizing Atypical Cardiac Symptoms: Beyond the Classic Chest Pain',
    category: 'Heart Health',
    readTime: '4 min read',
    date: 'September 24, 2026',
    author: 'Dr. Marcus Vance, MD',
    authorRole: 'Chief of Cardiology',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Cardiologists explain why fatigue, jaw tightness, and sudden nausea in women and diabetics are urgent signals that require immediate clinical evaluation.',
    content: [
      'While crushing retrosternal chest pressure remains the hallmark symptom of an acute myocardial infarction in textbook cases, clinical reality across modern emergency rooms shows a dramatically different picture.',
      'In particular, female patients, individuals with longstanding Type 2 diabetes, and elderly patients frequently exhibit subtle and atypical prodromal symptoms weeks before a major coronary event.',
      'Key symptoms to never ignore include unprovoked shortness of breath while resting, epigastric discomfort resembling acid reflux, unexplained severe fatigue lasting days, and radiating discomfort into the lower jaw or shoulder blade.',
      'At ShadowFlow MediCare Nexus, our Emergency Chest Pain Unit utilizes high-sensitivity Troponin-I assays that yield diagnostic clarity within 28 minutes of triage arrival.'
    ]
  },
  {
    id: 'art-2',
    title: 'The Golden Hour: Immediate Actions During Suspected Stroke (FAST Protocol)',
    category: 'Neurology',
    readTime: '5 min read',
    date: 'September 18, 2026',
    author: 'Dr. Elena Rostova, MD, PhD',
    authorRole: 'Director of Neuro-Critical Care',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Every single minute counts when cerebral blood supply is obstructed. Understand the FAST protocol and why self-driving to the ER can be life-threatening.',
    content: [
      'During an ischemic stroke, approximately 1.9 million neurons perish each minute the cerebral blood supply remains occluded. The concept of "Time is Brain" is the foundational pillar of modern neurology.',
      'Remember the FAST mnemonic: Face drooping (ask the person to smile), Arm weakness (ask them to raise both arms), Speech difficulty (is their phrase slurred or garbled?), and Time to call emergency dispatch immediately.',
      'Crucially, do not attempt to transport the patient via personal vehicle. Emergency medical service (EMS) ambulances activate the hospital "Code Stroke" while in transit, enabling the CT scanner and neuro-interventional cath team to be prepped before the ambulance even arrives.'
    ]
  },
  {
    id: 'art-3',
    title: 'Precision Robotic Joint Replacement: How 3D CT Guidance Accelerates Mobility',
    category: 'Orthopedics',
    readTime: '3 min read',
    date: 'September 12, 2026',
    author: 'Dr. Julian Thorne, MS, FRCS',
    authorRole: 'Director of Robotic Orthopedics',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Discover how personalized pre-operative 3D modeling eliminates soft tissue trauma and allows 92% of knee and hip patients to walk within 4 hours post-op.',
    content: [
      'Traditional joint replacement relies on generic jigs and mechanical alignments that do not account for individual patient kinematic variations. In contrast, robotic-arm guided arthroplasty begins with a high-resolution pre-surgical CT scan.',
      'The software constructs an exact 3D virtual replica of the patient unique bone architecture. During surgery, the haptic robotic arm prevents the surgeon from deviating even 0.5mm outside the pre-planned safety boundary.',
      'This surgical fidelity preserves vital collateral ligaments, minimizes bone resection, and drastically diminishes post-operative hematoma, enabling our patients to be safely ambulatory within hours of leaving the recovery room.'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    patientName: 'Jonathan Campbell',
    treatment: 'Emergency Percutaneous Coronary Intervention (PCI)',
    rating: 5,
    review: 'When I collapsed with acute chest pain at 2 AM, the paramedics and the ShadowFlow MediCare Nexus team functioned like clockwork. Dr. Vance placed two stents within 38 minutes of arrival. Today I have my life back.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
    date: 'August 2026'
  },
  {
    id: 't-2',
    patientName: 'Claire Abernathy',
    treatment: 'Robotic Total Knee Replacement',
    rating: 5,
    review: 'I had avoided knee surgery for 6 years out of fear. Dr. Thorne and the nursing team were incredible. I stood up 4 hours after surgery with almost zero pain, and walked my daughter down the aisle 6 weeks later!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    date: 'July 2026'
  },
  {
    id: 't-3',
    patientName: 'David & Rachel Sterling',
    treatment: 'Neonatal Critical Care (NICU Level IV)',
    rating: 5,
    review: 'Our twins were born premature at 29 weeks. The Level-IV NICU team and Dr. Priya Nair gave them round-the-clock love, clinical perfection, and empathy. The patient portal kept us informed every single second.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
    date: 'June 2026'
  }
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Upcoming Consultation Reminder',
    message: 'Your consultation with Dr. Marcus Vance is scheduled for Oct 2 at 11:00 AM (Room 408).',
    time: '20 mins ago',
    read: false,
    type: 'appointment',
    link: '/portal/patient/appointments'
  },
  {
    id: 'notif-2',
    title: 'Diagnostic Lab Test In Progress',
    message: 'Thyroid Function Ultra-Sensitive Profile is being processed by the central biochemistry lab.',
    time: '2 hours ago',
    read: false,
    type: 'lab',
    link: '/portal/patient/lab-reports'
  },
  {
    id: 'notif-3',
    title: 'New Digital Invoice Generated',
    message: 'Invoice SF-INV-88201 for $145.00 has been issued. Payment due by Oct 12, 2026.',
    time: 'Yesterday',
    read: true,
    type: 'billing',
    link: '/portal/patient/billing'
  },
  {
    id: 'notif-4',
    title: 'Annual Health Checkup Due',
    message: 'You are eligible for the Corporate Executive Wellness Package with complimentary cardiac calcium score.',
    time: '3 days ago',
    read: true,
    type: 'system',
    link: '/packages'
  }
];

export const HOSPITAL_STATS = [
  { label: 'Specialist Doctors', value: 150, suffix: '+', desc: 'Board certified clinicians across 32 medical disciplines' },
  { label: 'Medical Departments', value: 25, suffix: '+', desc: 'Comprehensive tertiary centers of clinical excellence' },
  { label: 'Patients Served', value: 50, suffix: 'K+', desc: 'Over 50,000 satisfied patients healed since inception' },
  { label: 'Emergency Support', value: 24, suffix: '/7', desc: 'Continuous Level-1 trauma & acute stroke code readiness' }
];
