import rawEtestData from './etestData.json';
import { ETestModule, SubjectCategory } from '../types';

export const GRADE_12_SUBJECTS: SubjectCategory[] = [
  { id: 4, nameKh: 'ផែនដីវិទ្យា', nameEn: 'Earth Science', categoryId: 2 },
  { id: 7, nameKh: 'ជីវវិទ្យា', nameEn: 'Biology', categoryId: 2 },
  { id: 6, nameKh: 'ភូមិវិទ្យា', nameEn: 'Geography', categoryId: 2 },
  { id: 3, nameKh: 'វប្បធម៌ទូទៅ', nameEn: 'General Knowledge', categoryId: 2 },
  { id: 2, nameKh: 'ប្រវត្តិវិទ្យា', nameEn: 'History', categoryId: 2 },
  { id: 8, nameKh: 'គីមីវិទ្យា', nameEn: 'Chemistry', categoryId: 2 },
  { id: 5, nameKh: 'ភាសាខ្មែរ', nameEn: 'Khmer Literature', categoryId: 2 },
  { id: 1, nameKh: 'សីលធម៌-ពលរដ្ឋ', nameEn: 'Morality & Civics', categoryId: 2 },
];

const CHEMISTRY_BONUS_MODULE: ETestModule = {
  id: 8,
  subjectId: 8,
  subjectName: 'គីមីវិទ្យា',
  subjectEn: 'Chemistry',
  views: 1540,
  participants: 94,
  durationMinutes: 60,
  questionCountPerExam: 20,
  title: 'សម្រាប់ប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (គីមីវិទ្យា)',
  questions: [
    {
      id: 9001,
      text: 'តើលោហៈណាមួយខាងក្រោមដែលមិនមានអំពើជាមួយសូលុយស្យុងអាស៊ីតក្លរីឌ្រិចរាវ (HCl)?',
      options: [
        { id: 90011, value: 'ស័ង្កសី (Zn)', label: 'ស័ង្កសី (Zn)' },
        { id: 90012, value: 'ទង់ដែង (Cu)', label: 'ទង់ដែង (Cu)' },
        { id: 90013, value: 'ដែក (Fe)', label: 'ដែក (Fe)' },
        { id: 90014, value: 'ម៉ាញេស្យូម (Mg)', label: 'ម៉ាញេស្យូម (Mg)' }
      ],
      correctIndex: 1
    },
    {
      id: 9002,
      text: 'នៅសីតុណ្ហភាព 25°C សូលុយស្យុងណឺតមានតម្លៃ pH ស្មើនឹងប៉ុន្មាន?',
      options: [
        { id: 90021, value: 'pH = 0', label: 'pH = 0' },
        { id: 90022, value: 'pH = 7', label: 'pH = 7' },
        { id: 90023, value: 'pH = 14', label: 'pH = 14' },
        { id: 90024, value: 'pH = 1', label: 'pH = 1' }
      ],
      correctIndex: 1
    },
    {
      id: 9003,
      text: 'រូបមន្តទូទៅរបស់អាល់កាន (Alkanes) គឺ៖',
      options: [
        { id: 90031, value: 'CnH2n', label: 'CnH2n' },
        { id: 90032, value: 'CnH2n+2', label: 'CnH2n+2' },
        { id: 90033, value: 'CnH2n-2', label: 'CnH2n-2' },
        { id: 90034, value: 'CnH2n+1OH', label: 'CnH2n+1OH' }
      ],
      correctIndex: 1
    },
    {
      id: 9004,
      text: 'ប្រតិកម្មរវាងអាស៊ីតកាបុកស៊ីលិច និងអាល់កុល បង្កើតបានជាទឹក និងសមាសធាតុអ្វី?',
      options: [
        { id: 90041, value: 'អាល់ដេអ៊ីត', label: 'អាល់ដេអ៊ីត' },
        { id: 90042, value: 'អេស្ទែ', label: 'អេស្ទែ' },
        { id: 90043, value: 'សេតូន', label: 'សេតូន' },
        { id: 90044, value: 'អេទែ', label: 'អេទែ' }
      ],
      correctIndex: 1
    },
    {
      id: 9005,
      text: 'តាមនិយមន័យប្រុងស្ទែត-ឡូរី (Brønsted-Lowry) អាស៊ីតគឺជាប្រភេទគីមីដែល៖',
      options: [
        { id: 90051, value: 'ទទួលប្រូតុង H+', label: 'ទទួលប្រូតុង H+' },
        { id: 90052, value: 'បោះបង់ប្រូតុង H+', label: 'បោះបង់ប្រូតុង H+' },
        { id: 90053, value: 'បោះបង់អេឡិចត្រុង', label: 'បោះបង់អេឡិចត្រុង' },
        { id: 90054, value: 'ទទួលអ៊ីយ៉ុង OH-', label: 'ទទួលអ៊ីយ៉ុង OH-' }
      ],
      correctIndex: 1
    },
    {
      id: 9006,
      text: 'នៅក្នុងថ្មពិលអេឡិចត្រូគីមី អេឡិចត្រូតដែលកើតមានអុកស៊ីតកម្មហៅថា៖',
      options: [
        { id: 90061, value: 'កាតូត (Cathode)', label: 'កាតូត (Cathode)' },
        { id: 90062, value: 'អាណូត (Anode)', label: 'អាណូត (Anode)' },
        { id: 90063, value: 'ស្ពានអំបិល', label: 'ស្ពានអំបិល' },
        { id: 90064, value: 'អេឡិចត្រូលីត', label: 'អេឡិចត្រូលីត' }
      ],
      correctIndex: 1
    },
    {
      id: 9007,
      text: 'តើកត្តាណាមួយខាងក្រោមដែលមិនធ្វើឱ្យល្បឿនប្រតិកម្មគីមីកើនឡើង?',
      options: [
        { id: 90071, value: 'ការបង្កើនសីតុណ្ហភាព', label: 'ការបង្កើនសីតុណ្ហភាព' },
        { id: 90072, value: 'ការបន្ថយកំហាប់អង្គធាតុប្រតិករ', label: 'ការបន្ថយកំហាប់អង្គធាតុប្រតិករ' },
        { id: 90073, value: 'ការប្រើកាតាលីករសមស្រប', label: 'ការប្រើកាតាលីករសមស្រប' },
        { id: 90074, value: 'ការបង្កើនផ្ទៃប៉ះនៃអង្គធាតុរឹង', label: 'ការបង្កើនផ្ទៃប៉ះនៃអង្គធាតុរឹង' }
      ],
      correctIndex: 1
    },
    {
      id: 9008,
      text: 'បង្គុំនាទីរបស់អាល់ដេអ៊ីត (Aldehyde) គឺ៖',
      options: [
        { id: 90081, value: '-OH', label: '-OH' },
        { id: 90082, value: '-CHO', label: '-CHO' },
        { id: 90083, value: '-COOH', label: '-COOH' },
        { id: 90084, value: '-NH2', label: '-NH2' }
      ],
      correctIndex: 1
    },
    {
      id: 9009,
      text: 'តើឧស្ម័នណាមួយដែលកើតឡើងនៅពេលដាក់សូដ្យូម (Na) ក្នុងទឹក?',
      options: [
        { id: 90091, value: 'អុកស៊ីសែន (O2)', label: 'អុកស៊ីសែន (O2)' },
        { id: 90092, value: 'អ៊ីដ្រូសែន (H2)', label: 'អ៊ីដ្រូសែន (H2)' },
        { id: 90093, value: 'កាបូនឌីអុកស៊ីត (CO2)', label: 'កាបូនឌីអុកស៊ីត (CO2)' },
        { id: 90094, value: 'ក្លរ (Cl2)', label: 'ក្លរ (Cl2)' }
      ],
      correctIndex: 1
    },
    {
      id: 9010,
      text: 'កម្រិតអុកស៊ីតកម្មរបស់អុកស៊ីសែនក្នុងសមាសធាតុភាគច្រើនគឺ៖',
      options: [
        { id: 90101, value: '-1', label: '-1' },
        { id: 90102, value: '-2', label: '-2' },
        { id: 90103, value: '+2', label: '+2' },
        { id: 90104, value: '0', label: '0' }
      ],
      correctIndex: 1
    },
    {
      id: 9011,
      text: 'សូលុយស្យុងដែលមានកំហាប់អ៊ីយ៉ុង [H3O+] = 1.0 × 10^-3 M មានតម្លៃ pH ស្មើនឹង៖',
      options: [
        { id: 90111, value: '3', label: '3' },
        { id: 90112, value: '11', label: '11' },
        { id: 90113, value: '7', label: '7' },
        { id: 90114, value: '-3', label: '-3' }
      ],
      correctIndex: 0
    },
    {
      id: 9012,
      text: 'អ៊ីដ្រូលីសនៃអេស្ទែក្នុងមជ្ឈដ្ឋានបាសខ្លាំង (NaOH) ហៅថាប្រតិកម្មអ្វី?',
      options: [
        { id: 90121, value: 'ប្រតិកម្មអេស្ទែកម្ម', label: 'ប្រតិកម្មអេស្ទែកម្ម' },
        { id: 90122, value: 'ប្រតិកម្មសាប៊ូកម្ម', label: 'ប្រតិកម្មសាប៊ូកម្ម' },
        { id: 90123, value: 'ប្រតិកម្មប៉ូលីមែកម្ម', label: 'ប្រតិកម្មប៉ូលីមែកម្ម' },
        { id: 90124, value: 'ប្រតិកម្មអ៊ីដ្រូសែនកម្ម', label: 'ប្រតិកម្មអ៊ីដ្រូសែនកម្ម' }
      ],
      correctIndex: 1
    },
    {
      id: 9013,
      text: 'អាមីន (Amines) មានលក្ខណៈគីមីជា៖',
      options: [
        { id: 90131, value: 'អាស៊ីតខ្លាំង', label: 'អាស៊ីតខ្លាំង' },
        { id: 90132, value: 'បាសខ្សោយ', label: 'បាសខ្សោយ' },
        { id: 90133, value: 'អាស៊ីតខ្សោយ', label: 'អាស៊ីតខ្សោយ' },
        { id: 90134, value: 'អំបិលណឺត', label: 'អំបិលណឺត' }
      ],
      correctIndex: 1
    },
    {
      id: 9014,
      text: 'សមាសធាតុ CH3-COOH មានឈ្មោះតាមអន្តរជាតិ (IUPAC) ថា៖',
      options: [
        { id: 90141, value: 'អាស៊ីតមេតាណូអ៊ិច', label: 'អាស៊ីតមេតាណូអ៊ិច' },
        { id: 90142, value: 'អាស៊ីតអេតាណូអ៊ិច', label: 'អាស៊ីតអេតាណូអ៊ិច' },
        { id: 90143, value: 'អាស៊ីតប្រូប៉ាណូអ៊ិច', label: 'អាស៊ីតប្រូប៉ាណូអ៊ិច' },
        { id: 90144, value: 'អេតាណុល', label: 'អេតាណុល' }
      ],
      correctIndex: 1
    },
    {
      id: 9015,
      text: 'ក្នុងចំណោមអាស៊ីតខាងក្រោម តើមួយណាជាអាស៊ីតខ្លាំង?',
      options: [
        { id: 90151, value: 'CH3COOH', label: 'CH3COOH' },
        { id: 90152, value: 'HNO3', label: 'HNO3' },
        { id: 90153, value: 'HF', label: 'HF' },
        { id: 90154, value: 'H2CO3', label: 'H2CO3' }
      ],
      correctIndex: 1
    },
    {
      id: 9016,
      text: 'សម្ព័ន្ធដែលភ្ជាប់អាស៊ីតអាមីនេពីរចូលគ្នាបង្កើតជាឌីប៉ិបទីតហៅថា៖',
      options: [
        { id: 90161, value: 'សម្ព័ន្ធអ៊ីដ្រូសែន', label: 'សម្ព័ន្ធអ៊ីដ្រូសែន' },
        { id: 90162, value: 'សម្ព័ន្ធប៉ិបទីត (-CO-NH-)', label: 'សម្ព័ន្ធប៉ិបទីត (-CO-NH-)' },
        { id: 90163, value: 'សម្ព័ន្ធអ៊ីយ៉ុង', label: 'សម្ព័ន្ធអ៊ីយ៉ុង' },
        { id: 90164, value: 'សម្ព័ន្ធអេស្ទែ', label: 'សម្ព័ន្ធអេស្ទែ' }
      ],
      correctIndex: 1
    },
    {
      id: 9017,
      text: 'តើអ៊ីយ៉ុងណាមួយដែលបង្កើតកករពណ៌សជាមួយសូលុយស្យុងប្រាក់នីត្រាត (AgNO3)?',
      options: [
        { id: 90171, value: 'NO3-', label: 'NO3-' },
        { id: 90172, value: 'Cl-', label: 'Cl-' },
        { id: 90173, value: 'Na+', label: 'Na+' },
        { id: 90174, value: 'K+', label: 'K+' }
      ],
      correctIndex: 1
    },
    {
      id: 9018,
      text: 'ផលគុណអ៊ីយ៉ុងនៃទឹក (Kw) នៅសីតុណ្ហភាព 25°C មានតម្លៃស្មើនឹង៖',
      options: [
        { id: 90181, value: '1.0 × 10^-7', label: '1.0 × 10^-7' },
        { id: 90182, value: '1.0 × 10^-14', label: '1.0 × 10^-14' },
        { id: 90183, value: '14', label: '14' },
        { id: 90184, value: '7', label: '7' }
      ],
      correctIndex: 1
    },
    {
      id: 9019,
      text: 'អាល់កុលដែលមានរូបមន្ត C2H5OH មានឈ្មោះថា៖',
      options: [
        { id: 90191, value: 'មេតាណុល', label: 'មេតាណុល' },
        { id: 90192, value: 'អេតាណុល', label: 'អេតាណុល' },
        { id: 90193, value: 'ប្រូប៉ាណុល', label: 'ប្រូប៉ាណុល' },
        { id: 90194, value: 'ប៊ុយតាណុល', label: 'ប៊ុយតាណុល' }
      ],
      correctIndex: 1
    },
    {
      id: 9020,
      text: 'ប្រតិកម្មដែលបញ្ចេញកម្ដៅទៅមជ្ឈដ្ឋានខាងក្រៅហៅថា៖',
      options: [
        { id: 90201, value: 'ប្រតិកម្មស្រូបកម្ដៅ (ΔH > 0)', label: 'ប្រតិកម្មស្រូបកម្ដៅ (ΔH > 0)' },
        { id: 90202, value: 'ប្រតិកម្មបញ្ចេញកម្ដៅ (ΔH < 0)', label: 'ប្រតិកម្មបញ្ចេញកម្ដៅ (ΔH < 0)' },
        { id: 90203, value: 'ប្រតិកម្មគ្មានកម្ដៅ (ΔH = 0)', label: 'ប្រតិកម្មគ្មានកម្ដៅ (ΔH = 0)' },
        { id: 90204, value: 'ប្រតិកម្មបញ្ច្រាស', label: 'ប្រតិកម្មបញ្ច្រាស' }
      ],
      correctIndex: 1
    }
  ]
};

export const ETEST_MODULES: ETestModule[] = [
  ...(rawEtestData as ETestModule[]),
  CHEMISTRY_BONUS_MODULE
];

export const TOTAL_UNIQUE_QUESTIONS = ETEST_MODULES.reduce(
  (sum, mod) => sum + mod.questions.length,
  0
);
