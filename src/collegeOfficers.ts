// =========================================================================
// SHAQRA UNIVERSITY CUSTODIANS & COLLEGES MAPPING
// الربط الآلي لموظفي الأمانات حسب الكلية — جامعة شقراء
// =========================================================================

export interface CollegeOfficer {
  collegeName: string;
  custodianName: string;
  contactExt: string;
  custodianOffice: string;
}

export const COLLEGE_OFFICERS_MAP: Record<string, CollegeOfficer> = {
  'كلية الحاسب وتقنية المعلومات': {
    collegeName: 'كلية الحاسب وتقنية المعلومات',
    custodianName: 'أ. فهد الرويس',
    contactExt: 'تحويلة: 4110 - مكتب 104',
    custodianOffice: 'مكتب الأمانات - الدور الأرضي (مكتب 104)'
  },
  'كلية الهندسة': {
    collegeName: 'كلية الهندسة',
    custodianName: 'أ. سلطان القحطاني',
    contactExt: 'تحويلة: 3205 - مكتب G-12',
    custodianOffice: 'وحدة شؤون الطلاب والأمانات (مكتب G-12)'
  },
  'كلية العلوم والدراسات الإنسانية': {
    collegeName: 'كلية العلوم والدراسات الإنسانية',
    custodianName: 'أ. خالد المقرن',
    contactExt: 'تحويلة: 2150 - مكتب 202',
    custodianOffice: 'مكتب أمانات الكلية - الدور الثاني (مكتب 202)'
  },
  'كلية إدارة الأعمال': {
    collegeName: 'كلية إدارة الأعمال',
    custodianName: 'أ. تركي الشيباني',
    contactExt: 'تحويلة: 5120 - مكتب 115',
    custodianOffice: 'وحدة الأمن والسلامة والأمانات (مكتب 115)'
  },
  'كلية الطب والعلوم الطبية': {
    collegeName: 'كلية الطب والعلوم الطبية',
    custodianName: 'أ. عبدالعزيز التميمي',
    contactExt: 'تحويلة: 6114 - مكتب 101',
    custodianOffice: 'وكالة الكلية للشؤون الأكاديمية (مكتب 101)'
  },
  'المكتبة المركزية والبهو الرئيسي': {
    collegeName: 'المكتبة المركزية والبهو الرئيسي',
    custodianName: 'أ. محمد العتيبي',
    contactExt: 'تحويلة: 1010 - مكتب الأمانات الموحد',
    custodianOffice: 'مكتب الاستقبال المركزي - بهو الجامعة الرئيسي'
  }
};

export const COLLEGES_NAMES = Object.keys(COLLEGE_OFFICERS_MAP);

export const DEFAULT_COLLEGE = 'كلية الحاسب وتقنية المعلومات';

export function getOfficerForCollege(college: string): CollegeOfficer {
  if (!college) return COLLEGE_OFFICERS_MAP[DEFAULT_COLLEGE];
  if (COLLEGE_OFFICERS_MAP[college]) return COLLEGE_OFFICERS_MAP[college];
  if (college.includes('حاسب') || college.includes('تقنية')) return COLLEGE_OFFICERS_MAP['كلية الحاسب وتقنية المعلومات'];
  if (college.includes('هندس')) return COLLEGE_OFFICERS_MAP['كلية الهندسة'];
  if (college.includes('علوم') || college.includes('إنسان')) return COLLEGE_OFFICERS_MAP['كلية العلوم والدراسات الإنسانية'];
  if (college.includes('إدار') || college.includes('أعمال')) return COLLEGE_OFFICERS_MAP['كلية إدارة الأعمال'];
  if (college.includes('طب')) return COLLEGE_OFFICERS_MAP['كلية الطب والعلوم الطبية'];
  if (college.includes('مكتب') || college.includes('بهو')) return COLLEGE_OFFICERS_MAP['المكتبة المركزية والبهو الرئيسي'];
  return COLLEGE_OFFICERS_MAP[DEFAULT_COLLEGE];
}

export function getOfficerExtNumber(college: string): string {
  const officer = getOfficerForCollege(college);
  const match = officer.contactExt.match(/\d{4}/);
  return match ? match[0] : '1010';
}
