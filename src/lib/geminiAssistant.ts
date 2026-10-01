import { GoogleGenAI } from '@google/genai';
import { supabase, isSupabaseConfigured } from './supabase';
import { LostItem } from '../App';
import { getOfficerForCollege, getOfficerExtNumber, DEFAULT_COLLEGE } from '../collegeOfficers';
import { NEW_ITEMS_SEQUENCE, VintageVectorType, VINTAGE_INLINE_SVGS } from '../vintageIllustrations';

// Read API Key from Vite environment variables (or process.env fallback)
const GEMINI_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  '';

export const isGeminiConfigured = Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 5);

let aiClient: GoogleGenAI | null = null;
if (isGeminiConfigured) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

export interface ExtractedLostReport {
  name: string;
  category: 'electronics' | 'documents' | 'belongings' | 'keys' | 'tools';
  categoryLabel: string;
  college: string;
  location: string;
  exactLocation: string;
  description: string;
  color?: string;
  marks?: string;
  phone?: string;
  officerName?: string;
  officerExt?: string;
}

export type AgentPersona = 'mahfooz' | 'sawn';

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user' | 'system';
  agent?: AgentPersona;
  text: string;
  timestamp: string;
  matchedItems?: LostItem[];
  proposedReport?: ExtractedLostReport;
  createdItem?: LostItem;
  requiresConfirmation?: boolean;
}

// College names normalized for matching
export function matchShaqraCollege(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('حاسب') || lower.includes('تقنية') || lower.includes('it') || lower.includes('cs')) {
    return 'كلية الحاسب وتقنية المعلومات';
  }
  if (lower.includes('هندس')) {
    return 'كلية الهندسة';
  }
  if (lower.includes('علوم') || lower.includes('إنسان') || lower.includes('انسان')) {
    return 'كلية العلوم والدراسات الإنسانية';
  }
  if (lower.includes('إدار') || lower.includes('ادارة') || lower.includes('أعمال') || lower.includes('اعمال')) {
    return 'كلية إدارة الأعمال';
  }
  if (lower.includes('طب') || lower.includes('صحي') || lower.includes('طبي')) {
    return 'كلية الطب والعلوم الطبية';
  }
  if (lower.includes('مكتب') || lower.includes('بهو') || lower.includes('رئيسي') || lower.includes('عام')) {
    return 'المكتبة المركزية والبهو الرئيسي';
  }
  return DEFAULT_COLLEGE;
}

export function detectCategory(text: string): { category: 'electronics' | 'documents' | 'belongings' | 'keys' | 'tools'; label: string } {
  const lower = text.toLowerCase();
  if (lower.includes('سماع') || lower.includes('جوال') || lower.includes('ايربود') || lower.includes('لابتوب') || lower.includes('شاحن') || lower.includes('ايباد') || lower.includes('ساعة') || lower.includes('حاسبة')) {
    return { category: 'electronics', label: 'إلكترونيات' };
  }
  if (lower.includes('بطاق') || lower.includes('هوي') || lower.includes('رخص') || lower.includes('دفتر') || lower.includes('كتاب') || lower.includes('ملف') || lower.includes('وثيق') || lower.includes('صراف')) {
    return { category: 'documents', label: 'وثائق وبطاقات' };
  }
  if (lower.includes('مفتاح') || lower.includes('مفاتيح') || lower.includes('ريموت')) {
    return { category: 'keys', label: 'مفاتيح' };
  }
  if (lower.includes('قلم') || lower.includes('نظار') || lower.includes('أداة') || lower.includes('مسطر')) {
    return { category: 'tools', label: 'أدوات ومستلزمات' };
  }
  return { category: 'belongings', label: 'مقتنيات شخصية' };
}

/**
 * Searches items in Supabase first (or in the local array if Supabase is offline)
 */
export async function searchLostItemsInDb(
  query: string,
  collegeFilter?: string,
  localItemsFallback: LostItem[] = []
): Promise<LostItem[]> {
  const cleanQuery = query.trim().toLowerCase();
  
  if (isSupabaseConfigured && supabase) {
    try {
      let supaQuery = supabase
        .from('lost_items')
        .select('*');

      if (collegeFilter && collegeFilter !== 'كل الكليات والمرافق') {
        supaQuery = supaQuery.eq('college', collegeFilter);
      }

      const { data, error } = await supaQuery;
      if (!error && data && data.length > 0) {
        const scored = data.map((d: any) => {
          let score = 0;
          const name = (d.name || '').toLowerCase();
          const desc = (d.description || '').toLowerCase();
          const loc = (d.location || '').toLowerCase();

          const tokens = cleanQuery.split(/\s+/).filter(t => t.length > 1);
          for (const token of tokens) {
            if (name.includes(token)) score += 5;
            if (desc.includes(token)) score += 3;
            if (loc.includes(token)) score += 2;
          }

          const mapped: LostItem = {
            id: d.id,
            name: d.name,
            refNumber: d.ref_number,
            category: d.category,
            categoryLabel: d.category_label,
            college: d.college,
            location: d.location,
            date: d.date_recorded,
            time: d.time_recorded,
            status: d.status,
            description: d.description || '',
            vectorType: (d.image_url && d.image_url in VINTAGE_INLINE_SVGS) ? d.image_url : 'notebook',
            image: '',
            custodianOffice: d.custodian_office,
            custodianName: d.custodian_name,
            contactExt: d.contact_ext
          };

          return { item: mapped, score };
        });

        const matches = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.item);
        if (matches.length > 0) return matches.slice(0, 4);
      }
    } catch (e) {
      console.warn('Error querying Supabase for assistant search:', e);
    }
  }

  // Fallback to local items array
  const tokens = cleanQuery.split(/\s+/).filter(t => t.length > 1);
  const scoredLocal = localItemsFallback.map(item => {
    let score = 0;
    const name = item.name.toLowerCase();
    const desc = item.description.toLowerCase();
    const loc = item.location.toLowerCase();
    const col = item.college.toLowerCase();

    if (collegeFilter && item.college === collegeFilter) score += 2;

    for (const token of tokens) {
      if (name.includes(token)) score += 5;
      if (desc.includes(token)) score += 3;
      if (loc.includes(token)) score += 2;
      if (col.includes(token)) score += 1;
    }
    return { item, score };
  });

  return scoredLocal.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.item).slice(0, 4);
}

/**
 * الوكيل الأول: "مَحْفُوظ" (مسؤول البحث والتحقق من المعثورات المسجلة حالياً)
 * يسأل سؤالاً واحداً فقط في كل رسالة لاستكمال التفاصيل، ويبحث في سجلات الأمانات.
 */
export async function processMahfoozTurn(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  allAvailableItems: LostItem[]
): Promise<{
  replyText: string;
  matchedItems?: LostItem[];
  triggerSawnHandoff?: boolean;
  draftItemName?: string;
  draftCollege?: string;
}> {
  // If Gemini API is configured
  if (isGeminiConfigured && aiClient) {
    try {
      const systemInstruction = `
أنت "مَحْفُوظ" (الوكيل الأول في منصة أمانات جامعة شقراء).
مسؤوليتك: البحث والتحقق من المعثورات المسجلة حالياً ومطابقتها مع ما يصفه الطالب.
قواعدك الصارمة:
1. التحدث بأسلوب جامعي سعودي لطيف وبسيط وموجز. اسمك هو "مَحْفُوظ".
2. قاعدة ذهبية: اسأل سؤالاً واحداً فقط وموجزاً في كل رسالة لاستكمال النواقص (مثل الكلية، أو اللون، أو العلامة). لا تسرد أسئلة معاً.
3. إذا طلب المستخدم رفع بلاغ جديد أو لم يجد غرضه في النتائج، جهّز التسليم لزميلك "صَوْن".
4. في نهاية ردك، ارفق هذا السطر المخفي:
<!--JSON:{"searchQuery":"...","college":"...","category":"...","name":"...","hasEnoughToSearch":true|false,"handoffToSawn":true|false}-->
`;

      const promptContents = [
        ...history.map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ];

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContents as any,
        config: {
          systemInstruction,
          temperature: 0.6
        }
      });

      const rawText = response.text || '';
      let extractedData: any = null;
      let cleanReply = rawText;
      const jsonMatch = rawText.match(/<!--JSON:([\s\S]*?)-->/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          extractedData = JSON.parse(jsonMatch[1]);
          cleanReply = rawText.replace(jsonMatch[0], '').trim();
        } catch (e) {
          console.warn('Failed to parse Gemini JSON:', e);
        }
      }

      if (extractedData?.handoffToSawn) {
        return {
          replyText: 'ولا تشيل هم، الحين بخليك تكمّل مع خويي «صَوْن» وتطمن مفقودك في الحفظ والصون.',
          triggerSawnHandoff: true,
          draftItemName: extractedData.name || userMessage,
          draftCollege: extractedData.college ? matchShaqraCollege(extractedData.college) : undefined
        };
      }

      if (extractedData?.hasEnoughToSearch && extractedData?.searchQuery) {
        const matches = await searchLostItemsInDb(
          extractedData.searchQuery,
          extractedData.college ? matchShaqraCollege(extractedData.college) : undefined,
          allAvailableItems
        );

        if (matches.length > 0) {
          return {
            replyText: cleanReply || 'وجدت هذه السجلات المطابقة في سجلات الأمانات، هل هذا هو مفقودك؟',
            matchedItems: matches,
            draftItemName: extractedData.name || extractedData.searchQuery,
            draftCollege: extractedData.college ? matchShaqraCollege(extractedData.college) : undefined
          };
        } else {
          return {
            replyText: 'بحثت لك في سجلات الأمانات الحالية ولم أجد معثوراً يطابق هذا الوصف حتى الآن. ولا تشيل هم، الحين بخليك تكمّل مع خويي «صَوْن» وتطمن مفقودك في الحفظ والصون.',
            triggerSawnHandoff: true,
            draftItemName: extractedData.name || extractedData.searchQuery,
            draftCollege: extractedData.college ? matchShaqraCollege(extractedData.college) : undefined
          };
        }
      }

      return {
        replyText: cleanReply,
        draftItemName: extractedData?.name,
        draftCollege: extractedData?.college ? matchShaqraCollege(extractedData.college) : undefined
      };
    } catch (err) {
      console.warn('Gemini call failed in Mahfooz, using local fallback:', err);
    }
  }

  // Local fallback heuristic for "محفوظ"
  const lowerMsg = userMessage.toLowerCase();
  if (
    lowerMsg.includes('ما حصلته') ||
    lowerMsg.includes('ما لقيته') ||
    lowerMsg.includes('مو هو') ||
    lowerMsg.includes('غير موجود') ||
    lowerMsg.includes('بلاغ جديد') ||
    lowerMsg.includes('صَوْن') ||
    lowerMsg.includes('صون')
  ) {
    return {
      replyText: 'ولا تشيل هم، الحين بخليك تكمّل مع خويي «صَوْن» وتطمن مفقودك في الحفظ والصون.',
      triggerSawnHandoff: true,
      draftItemName: userMessage,
      draftCollege: matchShaqraCollege(history.map(h => h.content).join(' '))
    };
  }

  const detectedCollege = matchShaqraCollege(userMessage);

  if (history.length <= 1) {
    return {
      replyText: `يا هلا بك! بالنسبة لـ (${userMessage.trim()})، في أي كلية أو مبنى بالجامعة تتوقع أنك فقدته؟`,
      draftItemName: userMessage
    };
  }

  if (history.length === 2 || history.length === 3) {
    return {
      replyText: 'ممتاز. ما هو لونه أو أبرز علامة مميزة فيه؟',
      draftItemName: history[1]?.content || userMessage,
      draftCollege: detectedCollege
    };
  }

  // Search local/Supabase DB
  const allText = [...history.map(h => h.content), userMessage].join(' ');
  const matches = await searchLostItemsInDb(allText, detectedCollege, allAvailableItems);

  if (matches.length > 0) {
    return {
      replyText: 'بحثت في سجلات الأمانات الحالية ووجدت هذه السجلات المحتملة، تفقدها وتأكد إذا كان أحدها مفقودك:',
      matchedItems: matches,
      draftItemName: history[1]?.content || userMessage,
      draftCollege: detectedCollege
    };
  } else {
    return {
      replyText: 'بحثت لك في قاعدة بيانات الأمانات الحالية ولم أعثر على غرض مطابق حتى هذه اللحظة. ولا تشيل هم، الحين بخليك تكمّل مع خويي «صَوْن» وتطمن مفقودك في الحفظ والصون.',
      triggerSawnHandoff: true,
      draftItemName: history[1]?.content || userMessage,
      draftCollege: detectedCollege
    };
  }
}

/**
 * الوكيل الثاني: "صَوْن" (وكيل الاستقبال والتوجيه الميداني | Field Dispatcher & Intake Agent)
 * محادثة تفاعلية بسؤال واحد محدد فقط في كل رسالة لاستيفاء التفاصيل قبل عرض مسودة البلاغ:
 * 1. الموقع الدقيق (في أي دور، قاعة، معمل، أو مدرج بالكلية؟).
 * 2. العلامات الفارقة واللون والخدوش.
 * 3. رقم الجوال للتواصل وتأكيد الإشعار.
 * 4. عرض بطاقة مسودة البلاغ للاعتماد النهائي وتوجيهه لمشرف الكلية.
 */
export async function processSawnTurn(
  userMessage: string,
  sawnStep: 'ask_location' | 'ask_marks' | 'ask_phone' | 'ready_confirmation',
  currentDraft: Partial<ExtractedLostReport>
): Promise<{
  replyText: string;
  nextStep: 'ask_marks' | 'ask_phone' | 'ready_confirmation';
  updatedDraft: ExtractedLostReport;
  showDraftCard: boolean;
}> {
  const updatedDraft: ExtractedLostReport = {
    name: currentDraft.name || 'غرض مفقود',
    category: currentDraft.category || 'belongings',
    categoryLabel: currentDraft.categoryLabel || 'مقتنيات شخصية',
    college: currentDraft.college || DEFAULT_COLLEGE,
    location: currentDraft.location || currentDraft.college || DEFAULT_COLLEGE,
    exactLocation: currentDraft.exactLocation || '',
    description: currentDraft.description || '',
    marks: currentDraft.marks || '',
    phone: currentDraft.phone || '',
    color: currentDraft.color || ''
  };

  // Step 1: User answered the location
  if (sawnStep === 'ask_location') {
    updatedDraft.exactLocation = userMessage.trim();
    const mentionedCollege = matchShaqraCollege(userMessage);
    if (mentionedCollege && mentionedCollege !== DEFAULT_COLLEGE) {
      updatedDraft.college = mentionedCollege;
    }
    updatedDraft.location = `${updatedDraft.college} - ${updatedDraft.exactLocation}`;

    return {
      replyText: 'تم تدوين الموقع بدقة. علمني وش أبرز العلامات الفارقة أو اللون أو الخدوش في الغرض؟',
      nextStep: 'ask_marks',
      updatedDraft,
      showDraftCard: false
    };
  }

  // Step 2: User answered the marks and details
  if (sawnStep === 'ask_marks') {
    updatedDraft.marks = userMessage.trim();
    const catInfo = detectCategory(updatedDraft.name + ' ' + userMessage);
    updatedDraft.category = catInfo.category;
    updatedDraft.categoryLabel = catInfo.label;

    return {
      replyText: 'ممتاز ودونت العلامات الفارقة. أخيرًا، زوّدني برقم جوالك للتواصل وتأكيد الإشعار فور العثور عليه:',
      nextStep: 'ask_phone',
      updatedDraft,
      showDraftCard: false
    };
  }

  // Step 3: User answered the phone number -> complete and show draft card
  const phoneMatch = userMessage.match(/(?:05\d{8}|9665\d{8}|\b\d{9,10}\b)/);
  if (phoneMatch) {
    updatedDraft.phone = phoneMatch[0];
  } else if (!updatedDraft.phone) {
    updatedDraft.phone = userMessage.trim() || '05XXXXXXXX';
  }

  updatedDraft.description = `الغرض: ${updatedDraft.name} | الموقع الدقيق: ${updatedDraft.exactLocation || 'غير محدد'} | العلامات الفارقة: ${updatedDraft.marks || 'حسب الوصف'} | رقم الجوال للتواصل: ${updatedDraft.phone}`;

  const officer = getOfficerForCollege(updatedDraft.college);
  const ext = getOfficerExtNumber(updatedDraft.college);
  updatedDraft.officerName = officer.custodianName;
  updatedDraft.officerExt = ext;

  return {
    replyText: `يعطيك العافية، استكملت كافة البيانات الأساسية مع «صَوْن».
تفضل بالاطلاع على مسودة البلاغ أدناه، وعند اعتمادك سيتم رفع التذكرة فوراً وتوجيهها للمشرف الميداني بالكلية: ${officer.custodianName} (تحويلة: ${ext}) للمتابعة الميدانية وحفظه لك.`,
    nextStep: 'ready_confirmation',
    updatedDraft,
    showDraftCard: true
  };
}

/**
 * تنفيذ اعتماد البلاغ من "صَوْن":
 * إنشاء التذكرة رسمياً، ربطها بمشرف الكلية، وإدراجها كبلاغ وارد ميداني لموظف الأمانات
 */
export async function executeAgent2CreateReport(
  report: ExtractedLostReport,
  roundRobinIndex: number
): Promise<{ success: boolean; createdItem: LostItem; message: string }> {
  const generatedRef = `SHQ-1447-${Math.floor(1000 + Math.random() * 9000)}`;
  const officer = getOfficerForCollege(report.college);
  const ext = getOfficerExtNumber(report.college);

  // Round-robin SVG assignment
  const assignedSvgKey = NEW_ITEMS_SEQUENCE[roundRobinIndex % NEW_ITEMS_SEQUENCE.length];
  const vectorType = assignedSvgKey as VintageVectorType;
  const itemSvg = VINTAGE_INLINE_SVGS[vectorType];

  let createdId = `item-${Date.now()}`;

  const fullDescription = `[بلاغ صَوْن الميداني] الموقع الدقيق: ${report.exactLocation || report.location} | الجوال: ${report.phone || 'غير مسجل'} | التفاصيل: ${report.marks || report.description}`;

  // If Supabase is configured, insert to `lost_items`
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('lost_items')
        .insert([
          {
            name: report.name.trim(),
            ref_number: generatedRef,
            category: report.category,
            category_label: report.categoryLabel,
            college: report.college,
            location: (report.exactLocation || report.location).trim(),
            date_recorded: '1447/09/23 هـ',
            time_recorded: 'الآن (بلاغ صَوْن الميداني)',
            status: 'محفوظ بالأمانات',
            description: fullDescription,
            image_url: vectorType,
            custodian_office: officer.custodianOffice,
            custodian_name: officer.custodianName,
            contact_ext: `تحويلة: ${ext} - ${officer.contactExt}`
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Sawn Supabase insert error:', error);
      } else if (data && data.id) {
        createdId = data.id;
      }
    } catch (e) {
      console.error('Sawn insert exception:', e);
    }
  }

  const createdItem: LostItem = {
    id: createdId,
    name: report.name.trim(),
    refNumber: generatedRef,
    category: report.category,
    categoryLabel: report.categoryLabel,
    college: report.college,
    location: (report.exactLocation || report.location).trim(),
    exactLocation: report.exactLocation || report.location,
    date: '1447/09/23 هـ',
    time: 'الآن',
    status: 'محفوظ بالأمانات',
    description: fullDescription,
    vectorType: vectorType,
    svg: itemSvg,
    image: '',
    custodianOffice: officer.custodianOffice,
    custodianName: officer.custodianName,
    contactExt: `تحويلة: ${ext}`,
    reportedByStudent: true,
    reportedByAgent: true,
    taskStatus: 'بانتظار التوجه الميداني',
    studentPhone: report.phone || '05XXXXXXXX'
  };

  return {
    success: true,
    createdItem,
    message: `تم توجيه البلاغ رسمياً إلى ${officer.custodianName} — تحويلة ${ext} للتحقق الميداني وحفظه لك.`
  };
}
