/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * مَحْفُوظ | أمانات الحرم الجامعي — جامعة شقراء
 * منصة مفقودات جامعة شقراء بتصميم ريترو بيج دافئ ومريح للعين
 * متوافق 100% مع الجوال والتابلت والديسكتوب.
 * الاسم البرمجي والإملائي الصارم: "مَحْفُوظ" بحرف الظاء.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import {
  VINTAGE_INLINE_SVGS,
  VintageVectorType,
  getVectorForCategory,
  CANONICAL_ITEM_VECTORS,
  airpodsSvg,
  keysSvg,
  walletSvg,
  idCardSvg,
  backpackSvg,
  laptopSvg,
  notebookSvg,
  calculatorSvg,
  watchSvg,
  toteBagSvg,
  NEW_ITEMS_SEQUENCE
} from './vintageIllustrations';
import {
  COLLEGE_OFFICERS_MAP,
  COLLEGES_NAMES,
  getOfficerForCollege,
  DEFAULT_COLLEGE
} from './collegeOfficers';
import {
  Search,
  Plus,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Layers,
  Building2,
  FileText,
  UserCheck,
  Briefcase,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  LogOut,
  AlertCircle,
  Tag,
  Phone,
  Camera,
  Check,
  Trash2,
  RefreshCw,
  Home,
  Globe,
  Minus,
  Square,
  ClipboardList,
  Award,
  Edit3,
  Lock,
  Bot,
  Sparkles
} from 'lucide-react';
import { LostAssistantModal } from './components/LostAssistantModal';

export interface LostItem {
  id: string;
  name: string;
  refNumber: string;
  category: 'electronics' | 'documents' | 'belongings' | 'keys' | 'tools';
  categoryLabel: string;
  college: string;
  location: string;
  date: string;
  time: string;
  status: 'محفوظ بالأمانات' | 'تم التسليم';
  description: string;
  vectorType: VintageVectorType;
  icon?: VintageVectorType;
  svg?: string;
  image?: string;
  custodianOffice: string;
  custodianName: string;
  contactExt: string;
  reportedByStudent?: boolean;
  reportedByAgent?: boolean;
  taskStatus?: 'بانتظار التوجه الميداني' | 'تم الحفظ بالأمانات';
  studentPhone?: string;
  exactLocation?: string;
}

const INITIAL_ITEMS: LostItem[] = [
  {
    id: 'item-1',
    name: 'سماعات أبل اللاسلكية بعلبة الشحن (AirPods Pro)',
    refNumber: 'SHQ-1447-9041',
    category: 'electronics',
    categoryLabel: 'إلكترونيات',
    college: 'المكتبة المركزية والبهو الرئيسي',
    location: 'صالة القراءة والاطلاع - الطاولة رقم 12',
    date: '1447/09/22 هـ',
    time: '02:00 ظهراً',
    status: 'محفوظ بالأمانات',
    description: 'سماعات إيربودز برو داخل علبة الشحن الأصلية بحالة ممتازة ومؤشر شحن أمامي سليم، وُجدت فوق طاولة المطالعة.',
    vectorType: 'airpods',
    icon: 'airpods',
    svg: airpodsSvg,
    custodianOffice: 'مكتب الاستقبال المركزي - بهو الجامعة الرئيسي',
    custodianName: 'أ. محمد العتيبي',
    contactExt: 'تحويلة: 1010 - مكتب الأمانات الموحد',
    reportedByStudent: true
  },
  {
    id: 'item-2',
    name: 'مفاتيح مركبة مع ميدالية جامعة شقراء محفورة',
    refNumber: 'SHQ-1447-9042',
    category: 'keys',
    categoryLabel: 'مفاتيح',
    college: 'كلية الهندسة',
    location: 'مواقف الطلاب الجنوبية - المسار رقم 4',
    date: '1447/09/19 هـ',
    time: '08:45 صباحاً',
    status: 'محفوظ بالأمانات',
    description: 'مفتاح ذكي لمركبة تويوتا مع نصل مفتاح مقصوص ليزرياً وميدالية برونزية محفور عليها شعار وحرف (ش) لجامعة شقراء.',
    vectorType: 'car_keys',
    icon: 'car_keys',
    svg: keysSvg,
    custodianOffice: 'وحدة شؤون الطلاب والأمانات (مكتب G-12)',
    custodianName: 'أ. سلطان القحطاني',
    contactExt: 'تحويلة: 3205 - مكتب G-12'
  },
  {
    id: 'item-3',
    name: 'محفظة جلدية طبيعية مع تفاصيل الخياطة والوثائق',
    refNumber: 'SHQ-1447-9043',
    category: 'belongings',
    categoryLabel: 'مقتنيات',
    college: 'كلية العلوم والدراسات الإنسانية',
    location: 'مدرج المحاضرات العام رقم 2',
    date: '1447/09/18 هـ',
    time: '11:10 صباحاً',
    status: 'محفوظ بالأمانات',
    description: 'محفظة جلدية طبيعية بنية بطيات وخياطة يدوية بارزة تحوي بطاقة صراف ورخصة قيادة وبطاقات شخصية.',
    vectorType: 'wallet',
    icon: 'wallet',
    svg: walletSvg,
    custodianOffice: 'مكتب أمانات الكلية - الدور الثاني (مكتب 202)',
    custodianName: 'أ. خالد المقرن',
    contactExt: 'تحويلة: 2150 - مكتب 202'
  },
  {
    id: 'item-4',
    name: 'بطاقة طالب جامعية وهوية أكاديمية رسمية',
    refNumber: 'SHQ-1447-9044',
    category: 'documents',
    categoryLabel: 'وثائق وبطاقات',
    college: 'كلية الطب والعلوم الطبية',
    location: 'معمل التشريح والمجهريات - الطابق الأرضي',
    date: '1447/09/21 هـ',
    time: '03:40 عصراً',
    status: 'محفوظ بالأمانات',
    description: 'بطاقة جامعية ممغنطة وهوية رسمية صادرة من عمادة القبول والتسجيل بجامعة شقراء برقم أكاديمي معتمد.',
    vectorType: 'student_id',
    icon: 'student_id',
    svg: idCardSvg,
    custodianOffice: 'وكالة الكلية للشؤون الأكاديمية (مكتب 101)',
    custodianName: 'أ. عبدالعزيز التميمي',
    contactExt: 'تحويلة: 6114 - مكتب 101'
  },
  {
    id: 'item-5',
    name: 'حقيبة ظهر دراسية قماشية بجيوب وسحابات متينة',
    refNumber: 'SHQ-1447-9045',
    category: 'belongings',
    categoryLabel: 'مقتنيات',
    college: 'كلية الحاسب وتقنية المعلومات',
    location: 'مصلى الطلاب - الممر الغربي',
    date: '1447/09/23 هـ',
    time: '12:45 ظهراً',
    status: 'محفوظ بالأمانات',
    description: 'حقيبة ظهر قماشية متينة بجيب أمامي وسحابات ومساحات مخصصة للدفاتر والمقتنيات الدراسية.',
    vectorType: 'backpack',
    icon: 'backpack',
    svg: backpackSvg,
    custodianOffice: 'مكتب الأمانات - الدور الأرضي (مكتب 104)',
    custodianName: 'أ. فهد الرويس',
    contactExt: 'تحويلة: 4110 - مكتب 104'
  },
  {
    id: 'item-6',
    name: 'حاسب محمول فائق النحافة (MacBook Air 13-inch)',
    refNumber: 'SHQ-1447-9046',
    category: 'electronics',
    categoryLabel: 'إلكترونيات',
    college: 'كلية إدارة الأعمال',
    location: 'معمل الحاسوب وتقنية المعلومات - القاعة 204',
    date: '1447/09/20 هـ',
    time: '10:30 صباحاً',
    status: 'محفوظ بالأمانات',
    description: 'جهاز حاسب محمول ماك بوك إير 13 بوصة بلون رمادي فضي، بهيكل ألومنيوم فائق النحافة ولوحة مفاتيح عربية/إنجليزية.',
    vectorType: 'laptop',
    icon: 'laptop',
    svg: laptopSvg,
    custodianOffice: 'وحدة الأمن والسلامة والأمانات (مكتب 115)',
    custodianName: 'أ. تركي الشيباني',
    contactExt: 'تحويلة: 5120 - مكتب 115'
  },
  {
    id: 'item-7',
    name: 'دفتر ملاحظات جامعي سلك مع قلم حبر هندسي',
    refNumber: 'SHQ-1447-9047',
    category: 'tools',
    categoryLabel: 'أدوات',
    college: 'كلية العلوم والدراسات الإنسانية',
    location: 'مكتبة الكلية الفرعية - ركن المراجع',
    date: '1447/09/22 هـ',
    time: '11:30 صباحاً',
    status: 'محفوظ بالأمانات',
    description: 'دفتر محاضرات جامعي بسلك لولبي وتخطيط دقيق، مع قلم حبر سائل برأس معدني مثلث ومشبك جيب فولاذي.',
    vectorType: 'notebook',
    icon: 'notebook',
    svg: notebookSvg,
    custodianOffice: 'مكتب أمانات الكلية - الدور الثاني (مكتب 202)',
    custodianName: 'أ. خالد المقرن',
    contactExt: 'تحويلة: 2150 - مكتب 202'
  },
  {
    id: 'item-8',
    name: 'آلة حاسبة علمية متطورة (Casio fx-991EX)',
    refNumber: 'SHQ-1447-9048',
    category: 'tools',
    categoryLabel: 'أدوات',
    college: 'كلية الهندسة',
    location: 'مدرج الرياضيات والمعادلات التفاضلية رقم 3',
    date: '1447/09/22 هـ',
    time: '09:15 صباحاً',
    status: 'تم التسليم',
    description: 'آلة حاسبة كاسيو علمية متطورة بشاشة عرض مصفوفية فائقة الدقة وخلايا شمسية علوية، سُلمت للطالب صاحبها بعد التحقق.',
    vectorType: 'calculator',
    icon: 'calculator',
    svg: calculatorSvg,
    custodianOffice: 'وحدة شؤون الطلاب والأمانات (مكتب G-12)',
    custodianName: 'أ. سلطان القحطاني',
    contactExt: 'تحويلة: 3205 - مكتب G-12',
    reportedByStudent: true
  },
  {
    id: 'item-sawn-1',
    name: 'شاحن حاسب محمول Type-C أصلي (65W)',
    refNumber: 'SHQ-1447-9051',
    category: 'electronics',
    categoryLabel: 'إلكترونيات',
    college: 'كلية الحاسب وتقنية المعلومات',
    location: 'معمل الحاسب 2 - الدور الأرضي - قاعة 108',
    exactLocation: 'معمل الحاسب 2 - الدور الأرضي - قاعة 108',
    date: '1447/09/23 هـ',
    time: '11:15 صباحاً',
    status: 'محفوظ بالأمانات',
    description: '[بلاغ صَوْن الميداني] الموقع الدقيق: معمل الحاسب 2 الدور الأرضي | الجوال: 0554129871 | التفاصيل: شاحن لابتوب أسود سلك طويل مع ملصق أزرق صغير عند المنفذ',
    vectorType: 'laptop',
    icon: 'laptop',
    svg: laptopSvg,
    custodianOffice: 'مكتب الأمانات - الدور الأرضي (مكتب 104)',
    custodianName: 'أ. فهد الرويس',
    contactExt: 'تحويلة: 4110 - مكتب 104',
    reportedByStudent: true,
    reportedByAgent: true,
    taskStatus: 'بانتظار التوجه الميداني',
    studentPhone: '0554129871'
  },
  {
    id: 'item-sawn-2',
    name: 'سماعات رأس لاسلكية سوني (Sony WH-1000XM4)',
    refNumber: 'SHQ-1447-9052',
    category: 'electronics',
    categoryLabel: 'إلكترونيات',
    college: 'كلية الهندسة',
    location: 'مدرج المحاضرات رقم 4 - الطابق الأول',
    exactLocation: 'مدرج المحاضرات رقم 4 - الطابق الأول',
    date: '1447/09/23 هـ',
    time: '09:30 صباحاً',
    status: 'محفوظ بالأمانات',
    description: '[بلاغ صَوْن الميداني] الموقع الدقيق: مدرج 4 الطابق الأول الصف الثالث | الجوال: 0503321980 | التفاصيل: سماعة رأس سوني رمادية داخل حقيبتها القماشية السوداء',
    vectorType: 'airpods',
    icon: 'airpods',
    svg: airpodsSvg,
    custodianOffice: 'وحدة شؤون الطلاب والأمانات (مكتب G-12)',
    custodianName: 'أ. سلطان القحطاني',
    contactExt: 'تحويلة: 3205 - مكتب G-12',
    reportedByStudent: true,
    reportedByAgent: true,
    taskStatus: 'تم الحفظ بالأمانات',
    studentPhone: '0503321980'
  }
];

export const getItemSvg = (item?: LostItem | null): string => {
  if (!item) return VINTAGE_INLINE_SVGS.notebook;
  if (item.svg) return item.svg;
  if (item.id && CANONICAL_ITEM_VECTORS[item.id]) {
    return VINTAGE_INLINE_SVGS[CANONICAL_ITEM_VECTORS[item.id]];
  }
  const vector = item.vectorType || item.icon || getVectorForCategory(item.category, item.name);
  return VINTAGE_INLINE_SVGS[vector] || VINTAGE_INLINE_SVGS.notebook;
};

const COLLEGES_LIST = [
  'كل الكليات والمرافق',
  'كلية الحاسب وتقنية المعلومات',
  'كلية الهندسة',
  'كلية العلوم والدراسات الإنسانية',
  'كلية إدارة الأعمال',
  'كلية الطب والعلوم الطبية',
  'المكتبة المركزية والبهو الرئيسي'
];

export default function App() {
  // Authentication / Gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'student' | 'staff' | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // CRT Turn-On Static Noise effect for 1.5 seconds on initial load
  const [showCrtNoise, setShowCrtNoise] = useState<boolean>(true);
  const [isFadingNoise, setIsFadingNoise] = useState<boolean>(false);
  const crtCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = crtCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = performance.now();
    const DURATION = 1500;
    const w = 240;
    const h = 180;
    canvas.width = w;
    canvas.height = h;
    const imgData = ctx.createImageData(w, h);
    const buffer = new Uint32Array(imgData.data.buffer);

    const render = (time: number) => {
      const elapsed = time - startTime;
      if (elapsed < DURATION) {
        const len = buffer.length;
        for (let i = 0; i < len; i++) {
          const val = Math.random() < 0.5 ? (Math.random() * 255) | 0 : (Math.random() * 120) | 0;
          buffer[i] = (255 << 24) | (((val * 0.85) | 0) << 16) | (((val * 0.95) | 0) << 8) | val;
        }
        ctx.putImageData(imgData, 0, 0);
        animId = requestAnimationFrame(render);
      } else {
        setIsFadingNoise(true);
        setTimeout(() => {
          setShowCrtNoise(false);
        }, 550);
      }
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Predefined Round-Robin counter for newly reported items
  const newItemCounterRef = React.useRef<number>(0);

  // Data & Filters
  const [items, setItems] = useState<LostItem[]>(INITIAL_ITEMS);
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCollege, setSelectedCollege] = useState<string>('كل الكليات والمرافق');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load items from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function fetchItems() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase!
          .from('lost_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching from Supabase:', error);
          return;
        }

        if (data && data.length > 0) {
          const mappedItems: LostItem[] = data.map((d: any) => ({
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
            vectorType: (d.image_url && d.image_url in VINTAGE_INLINE_SVGS) ? d.image_url : getVectorForCategory(d.category, d.name),
            image: '',
            custodianOffice: d.custodian_office,
            custodianName: d.custodian_name,
            contactExt: d.contact_ext
          }));
          setItems(mappedItems);
        }
      } catch (err) {
        console.error('Fetch exception:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, []);

  // Modals & Action States
  const [activeModalItem, setActiveModalItem] = useState<LostItem | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isMyItemsOpen, setIsMyItemsOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<LostItem | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editCategory, setEditCategory] = useState<'electronics' | 'documents' | 'belongings' | 'keys' | 'tools'>('electronics');
  const [editCollege, setEditCollege] = useState<string>('كلية علوم الحاسب والمعلومات');
  const [editLocation, setEditLocation] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  const [claimSubmitted, setClaimSubmitted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<LostItem | null>(null);

  // Staff View: Tabs and filters for Sawn field agent tickets
  const [staffViewTab, setStaffViewTab] = useState<'agent_tickets' | 'inventory'>('agent_tickets');
  const [agentTicketsFilter, setAgentTicketsFilter] = useState<'all' | 'pending' | 'stored'>('all');

  // Agent Tickets list & counts
  const agentTickets = useMemo(() => {
    return items.filter(
      item =>
        item.reportedByAgent === true ||
        item.taskStatus !== undefined ||
        item.description.includes('[بلاغ صَوْن الميداني]') ||
        item.description.includes('صَوْن')
    );
  }, [items]);

  const pendingAgentTicketsCount = useMemo(() => {
    return agentTickets.filter(t => t.taskStatus === 'بانتظار التوجه الميداني').length;
  }, [agentTickets]);

  const storedAgentTicketsCount = useMemo(() => {
    return agentTickets.filter(t => t.taskStatus === 'تم الحفظ بالأمانات').length;
  }, [agentTickets]);

  const filteredAgentTickets = useMemo(() => {
    if (agentTicketsFilter === 'pending') {
      return agentTickets.filter(t => t.taskStatus === 'بانتظار التوجه الميداني');
    }
    if (agentTicketsFilter === 'stored') {
      return agentTickets.filter(t => t.taskStatus === 'تم الحفظ بالأمانات');
    }
    return agentTickets;
  }, [agentTickets, agentTicketsFilter]);

  // Volunteer hours calculation: Volunteer contributions (+2 hours upon delivery to owner), personal lost items = 0 hours
  const myItemsList = useMemo(() => {
    return items.filter(i => i.reportedByStudent);
  }, [items]);

  const volunteerHours = useMemo(() => {
    const deliveredCount = myItemsList.filter(
      i => i.status === 'تم التسليم' && (!i.description.includes('[مفقود شخصي') || i.description.includes('[مساهمة تطوعية]'))
    ).length;
    return deliveredCount * 2;
  }, [myItemsList]);

  // Open edit modal
  const handleOpenEdit = (item: LostItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditCollege(item.college);
    setEditLocation(item.location);
    setEditDescription(item.description);
  };

  // Save edited item
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editName.trim() || !editLocation.trim()) return;

    const categoryLabels: Record<string, string> = {
      electronics: 'إلكترونيات',
      documents: 'وثائق وبطاقات',
      belongings: 'مقتنيات شخصية',
      keys: 'مفاتيح',
      tools: 'أدوات ومستلزمات'
    };
    const catLabel = categoryLabels[editCategory] || 'أخرى';
    const officer = getOfficerForCollege(editCollege);

    setIsSavingEdit(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase
          .from('lost_items')
          .update({
            name: editName.trim(),
            category: editCategory,
            category_label: catLabel,
            college: editCollege,
            location: editLocation.trim(),
            description: editDescription.trim(),
            custodian_name: officer.custodianName,
            contact_ext: officer.contactExt,
            custodian_office: officer.custodianOffice
          })
          .eq('ref_number', editingItem.refNumber);
      }

      setItems(prev =>
        prev.map(i =>
          i.id === editingItem.id || i.refNumber === editingItem.refNumber
            ? {
                ...i,
                name: editName.trim(),
                category: editCategory,
                categoryLabel: catLabel,
                college: editCollege,
                location: editLocation.trim(),
                description: editDescription.trim(),
                custodianName: officer.custodianName,
                contactExt: officer.contactExt,
                custodianOffice: officer.custodianOffice
              }
            : i
        )
      );

      if (activeModalItem && (activeModalItem.id === editingItem.id || activeModalItem.refNumber === editingItem.refNumber)) {
        setActiveModalItem(prev =>
          prev
            ? {
                ...prev,
                name: editName.trim(),
                category: editCategory,
                categoryLabel: catLabel,
                college: editCollege,
                location: editLocation.trim(),
                description: editDescription.trim(),
                custodianName: officer.custodianName,
                contactExt: officer.contactExt,
                custodianOffice: officer.custodianOffice
              }
            : null
        );
      }

      setEditingItem(null);
      showToast('تم حفظ وتحديث بيانات المعثور بنجاح');
    } catch (err) {
      console.error('Error saving edit:', err);
      showToast('حدث خطأ أثناء حفظ التعديل');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Typewriter Sequential Animation States for Student Welcome Banner
  const [typedPart1, setTypedPart1] = useState<string>('');
  const [typedPart2, setTypedPart2] = useState<string>('');
  const [showSubtitle, setShowSubtitle] = useState<boolean>(false);
  const [isCursorActive, setIsCursorActive] = useState<boolean>(true);

  // Trigger typewriter sequence when in student view
  useEffect(() => {
    if (userRole !== 'student') return;

    let isCancelled = false;
    const part1Target = 'ضاع منك شي؟';
    const part2Target = ' تراه في الحفظ والصون';

    setTypedPart1('');
    setTypedPart2('');
    setShowSubtitle(false);
    setIsCursorActive(true);

    let charIndex1 = 0;
    const typeInterval1 = setInterval(() => {
      if (isCancelled) return;
      if (charIndex1 < part1Target.length) {
        setTypedPart1(part1Target.slice(0, charIndex1 + 1));
        charIndex1++;
      } else {
        clearInterval(typeInterval1);
        // Wait exactly 2.0s (2000ms delay) before typing the second part
        setTimeout(() => {
          if (isCancelled) return;
          let charIndex2 = 0;
          const typeInterval2 = setInterval(() => {
            if (isCancelled) return;
            if (charIndex2 < part2Target.length) {
              setTypedPart2(part2Target.slice(0, charIndex2 + 1));
              charIndex2++;
            } else {
              clearInterval(typeInterval2);
              setIsCursorActive(false); // Cursor disappears after sentence completion
              // 0.5s (500ms) delay after completion, then fade-in subtitle
              setTimeout(() => {
                if (!isCancelled) {
                  setShowSubtitle(true);
                }
              }, 500);
            }
          }, 60);
        }, 2000);
      }
    }, 70);

    return () => {
      isCancelled = true;
      clearInterval(typeInterval1);
    };
  }, [userRole]);

  // Handle Update Status (UPDATE operation in Supabase)
  const handleUpdateStatus = async (item: LostItem) => {
    const newStatus: 'محفوظ بالأمانات' | 'تم التسليم' =
      item.status === 'محفوظ بالأمانات' ? 'تم التسليم' : 'محفوظ بالأمانات';
    setIsUpdatingStatus(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('lost_items')
          .update({ status: newStatus })
          .eq('ref_number', item.refNumber);

        if (error) {
          console.error('Update status error:', error);
          showToast(`تعذر تحديث الحالة في قاعدة البيانات: ${error.message}`);
          return;
        }
      }

      setItems(prev =>
        prev.map(i => (i.id === item.id || i.refNumber === item.refNumber ? { ...i, status: newStatus } : i))
      );
      if (activeModalItem && (activeModalItem.id === item.id || activeModalItem.refNumber === item.refNumber)) {
        setActiveModalItem(prev => (prev ? { ...prev, status: newStatus } : null));
      }
      showToast(`تم تحديث حالة المعثور إلى: [${newStatus}] بنجاح`);
    } catch (err: any) {
      console.error('Update status exception:', err);
      showToast('حدث خطأ أثناء تحديث الحالة');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Confirm Delete (DELETE operation in Supabase)
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('lost_items')
          .delete()
          .eq('ref_number', itemToDelete.refNumber);

        if (error) {
          console.error('Delete error:', error);
          showToast(`تعذر حذف المعثور من قاعدة البيانات: ${error.message}`);
          return;
        }
      }

      setItems(prev =>
        prev.filter(i => i.id !== itemToDelete.id && i.refNumber !== itemToDelete.refNumber)
      );
      if (activeModalItem && (activeModalItem.id === itemToDelete.id || activeModalItem.refNumber === itemToDelete.refNumber)) {
        setActiveModalItem(null);
      }
      const deletedRef = itemToDelete.refNumber;
      setItemToDelete(null);
      showToast(`تم حذف المعثور [${deletedRef}] نهائياً من قاعدة البيانات والمنصة.`);
    } catch (err: any) {
      console.error('Delete exception:', err);
      showToast('حدث خطأ أثناء حذف المعثور');
    } finally {
      setIsDeleting(false);
    }
  };

  // Student Profile & Login Gate States
  const [studentName, setStudentName] = useState<string>('ناصر الدوسري');
  const [studentId, setStudentId] = useState<string>('442109876');
  const [isStudentLoginModalOpen, setIsStudentLoginModalOpen] = useState<boolean>(false);
  const [loginStudentIdInput, setLoginStudentIdInput] = useState<string>('442109876');
  const [loginPasswordInput, setLoginPasswordInput] = useState<string>('••••••••');

  // New item form state (Ownership selection & Camera support)
  const [ownershipType, setOwnershipType] = useState<'personal' | 'contribution'>('personal');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStudentLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idVal = loginStudentIdInput.trim() || '442109876';
    setStudentId(idVal);
    setStudentName('ناصر الدوسري');
    setIsStudentLoginModalOpen(false);
    handleLogin('student');
  };

  // New item form state
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<'electronics' | 'documents' | 'belongings' | 'keys' | 'tools'>('electronics');
  const [newItemCollege, setNewItemCollege] = useState<string>(DEFAULT_COLLEGE);
  const [newItemLocation, setNewItemLocation] = useState<string>('');
  const [newItemDescription, setNewItemDescription] = useState<string>('');
  const [newItemCustodian, setNewItemCustodian] = useState<string>('أ. فهد الرويس');
  const [newItemExt, setNewItemExt] = useState<string>('تحويلة: 4110 - مكتب 104');

  // Handle Login Gate selection
  const handleLogin = (role: 'student' | 'staff') => {
    setIsFlashing(true);
    setTimeout(() => {
      setUserRole(role);
      setIsAuthenticated(true);
      setIsFlashing(false);
      showToast(`أهلاً بك في منصة مَحْفُوظ (${role === 'student' ? 'حساب طالب' : 'حساب موظف أمانات'})`);
    }, 300);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveModalItem(null);
    setIsRegisterOpen(false);
    setIsAssistantOpen(false);
    setIsStudentLoginModalOpen(false);
    setOwnershipType('personal');
    setCapturedImage(null);
  };

  const handleAssistantItemCreated = (newItem: LostItem) => {
    setItems(prev => [newItem, ...prev]);
    showToast(`تم توجيه البلاغ برقم [${newItem.refNumber}] إلى مشرف الكلية بنجاح`);
  };

  const handleReceiveAndStoreInSafe = async (item: LostItem) => {
    try {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('lost_items')
            .update({
              status: 'محفوظ بالأمانات'
            })
            .eq('ref_number', item.refNumber);
        } catch (e) {
          console.warn('Supabase update status failed:', e);
        }
      }

      setItems(prev =>
        prev.map(it => {
          if (it.refNumber === item.refNumber || it.id === item.id) {
            return {
              ...it,
              status: 'محفوظ بالأمانات',
              taskStatus: 'تم الحفظ بالأمانات'
            };
          }
          return it;
        })
      );

      showToast(`✓ تم تحديث البلاغ [${item.refNumber}]: استلم وحُفظ في صندوق الأمانات بنجاح`);
    } catch (err) {
      console.error('Error updating item to safe:', err);
    }
  };

  const handleAssistantSelectItemDetails = (item: LostItem) => {
    setActiveModalItem(item);
    setClaimSubmitted(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.refNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCollege =
        selectedCollege === 'كل الكليات والمرافق' ||
        item.college === selectedCollege;

      const matchCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory;

      return matchSearch && matchCollege && matchCategory;
    });
  }, [items, searchQuery, selectedCollege, selectedCategory]);

  // Statistics
  const totalCount = items.length;
  const inCustodyCount = items.filter(i => i.status === 'محفوظ بالأمانات').length;
  const deliveredCount = items.filter(i => i.status === 'تم التسليم').length;

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: items.length,
      electronics: items.filter(i => i.category === 'electronics').length,
      documents: items.filter(i => i.category === 'documents').length,
      belongings: items.filter(i => i.category === 'belongings').length,
      keys: items.filter(i => i.category === 'keys').length,
      tools: items.filter(i => i.category === 'tools').length,
    };
  }, [items]);

  // Handle register new item
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemLocation.trim()) {
      alert('يرجى كتابة اسم المعثور وموقع العثور عليه بالتفصيل.');
      return;
    }

    if (ownershipType === 'contribution' && !capturedImage) {
      alert('يرجى تصوير المعثور أو رفع صورة لتوثيق المساهمة التطوعية واحتساب الساعات.');
      return;
    }

    const categoryLabels: Record<string, string> = {
      electronics: 'إلكترونيات',
      documents: 'وثائق وبطاقات',
      belongings: 'مقتنيات شخصية',
      keys: 'مفاتيح',
      tools: 'أدوات ومستلزمات'
    };

    const generatedRef = `SHQ-1447-${Math.floor(1000 + Math.random() * 9000)}`;
    const categoryLabel = categoryLabels[newItemCategory] || 'أخرى';
    const officer = getOfficerForCollege(newItemCollege);
    const custodianOffice = officer.custodianOffice;
    const custodianName = officer.custodianName;
    const contactExt = officer.contactExt;

    const ownershipPrefix = ownershipType === 'personal'
      ? `[مفقود شخصي للطالب: ${studentName}]`
      : `[مساهمة تطوعية من الطالب: ${studentName}]`;
    const description = `${ownershipPrefix} ${newItemDescription.trim() || 'معثور تم توثيقه لدى أمانات الكلية بانتظار تسليمه لصاحبه.'}`;

    // Predefined 8-step Deterministic Round-Robin sequence for added items:
    // 1: watch, 2: tote, 3: wallet, 4: keys, 5: airpods, 6: laptop, 7: notebook, 8: calculator
    const assignedSvgKey = NEW_ITEMS_SEQUENCE[newItemCounterRef.current % NEW_ITEMS_SEQUENCE.length];
    newItemCounterRef.current += 1;
    const vectorType = assignedSvgKey as VintageVectorType;
    const itemSvg = VINTAGE_INLINE_SVGS[vectorType];

    setIsSubmitting(true);

    try {
      let createdId = `item-${Date.now()}`;

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('lost_items')
          .insert([
            {
              name: newItemName.trim(),
              ref_number: generatedRef,
              category: newItemCategory,
              category_label: categoryLabel,
              college: newItemCollege,
              location: newItemLocation.trim(),
              date_recorded: '1447/09/23 هـ',
              time_recorded: 'الآن',
              status: 'محفوظ بالأمانات',
              description: description,
              image_url: vectorType,
              custodian_office: custodianOffice,
              custodian_name: custodianName,
              contact_ext: contactExt
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          alert('تعذر حفظ المعثور في قاعدة البيانات: ' + error.message);
          setIsSubmitting(false);
          return;
        }

        if (data && data.id) {
          createdId = data.id;
        }
      }

      const newCreatedItem: LostItem = {
        id: createdId,
        name: newItemName.trim(),
        refNumber: generatedRef,
        category: newItemCategory,
        categoryLabel: categoryLabel,
        college: newItemCollege,
        location: newItemLocation.trim(),
        date: '1447/09/23 هـ',
        time: 'الآن',
        status: 'محفوظ بالأمانات',
        description: description,
        vectorType: vectorType,
        svg: itemSvg,
        image: capturedImage || '',
        custodianOffice: custodianOffice,
        custodianName: custodianName,
        contactExt: contactExt,
        reportedByStudent: userRole === 'student'
      };

      setItems((prev) => [newCreatedItem, ...prev]);
      setIsRegisterOpen(false);
      setNewItemName('');
      setNewItemLocation('');
      setNewItemDescription('');
      setOwnershipType('personal');
      setCapturedImage(null);
      showToast(`تم تسجيل المعثور بنجاح برقم مرجعي [${newCreatedItem.refNumber}] وهو الآن في الحفظ والصون.`);
    } catch (err: any) {
      console.error('Insert exception:', err);
      alert('حدث خطأ غير متوقع أثناء الحفظ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D5CBB9] text-[#3e271b] relative selection:bg-[#5a3e2b] selection:text-[#FAF7F0] flex flex-col justify-between">
      {/* Ultra-subtle scanlines overlay (max 3% opacity for soothing retro comfort without eye fatigue) */}
      <div className="fixed inset-0 scanlines-subtle pointer-events-none z-40" />

      {/* Quick 0.3s transition flash */}
      {isFlashing && (
        <div className="fixed inset-0 bg-[#ffffff] animate-quick-flash pointer-events-none z-50" />
      )}

      {/* Floating notification toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg bg-[#5a3e2b] text-[#FAF7F0] text-sm font-medium shadow-lg border border-[#8e684d] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: RETRO CRT TV LOGIN GATE (Chassis with knobs, vents, glowing LED)
          ========================================================================= */}
      {!isAuthenticated ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 z-20">
          {/* CRT TV Chassis */}
          <div className="w-full max-w-4xl bg-gradient-to-b from-[#2e2017] via-[#3a291e] to-[#1c130d] p-3 sm:p-6 rounded-3xl border-4 sm:border-8 border-[#170e08] shadow-[0_25px_60px_rgba(30,18,10,0.5)] relative">
            
            {/* Top Ventilation Grilles */}
            <div className="w-full flex justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 opacity-50">
              <div className="w-8 sm:w-12 h-1 bg-[#0f0906] rounded-full" />
              <div className="w-8 sm:w-12 h-1 bg-[#0f0906] rounded-full" />
              <div className="w-8 sm:w-12 h-1 bg-[#0f0906] rounded-full" />
              <div className="w-8 sm:w-12 h-1 bg-[#0f0906] rounded-full" />
              <div className="w-8 sm:w-12 h-1 bg-[#0f0906] rounded-full" />
              <div className="w-8 sm:w-12 h-1 bg-[#0f0906] rounded-full" />
            </div>

            {/* TV Screen & Side Control Panel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
              
              {/* Left/Center: CRT Screen Tube Housing (9 cols on desktop) */}
              <div className="md:col-span-9 bg-[#130d09] p-2.5 sm:p-4 rounded-2xl border-4 border-[#251a13] shadow-[inset_0_4px_12px_rgba(0,0,0,0.85)] relative overflow-hidden">
                
                {/* CRT Screen Glass Surface */}
                <div className="crt-glass rounded-xl border-4 border-[#4d3a2c] relative overflow-hidden flex flex-col justify-between p-3 sm:p-5 shadow-[inset_0_0_35px_rgba(40,25,15,0.4)]">
                  
                  {/* CRT Static Noise & Turn-On Flicker Overlay (Active for 1.5 seconds on initial load) */}
                  {showCrtNoise && (
                    <div
                      className={`absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-lg transition-all duration-500 ${
                        isFadingNoise ? 'opacity-0 filter brightness-200' : 'opacity-100'
                      }`}
                    >
                      <canvas ref={crtCanvasRef} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90" />
                      <div className="absolute inset-0 bg-repeat opacity-60 crt-noise-bg" />
                      <div className="crt-turnon-beam absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <div className="crt-sync-wave absolute inset-x-0 h-24 pointer-events-none" />
                      <div className="crt-startup-flicker absolute inset-0 pointer-events-none" />
                    </div>
                  )}

                  {/* CRT Scanline Overlay */}
                  <div className="absolute inset-0 scanlines-subtle pointer-events-none z-10" />

                  {/* Top OSD Status Bar */}
                  <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#6e5849] font-bold border-b border-[#a8988a]/40 pb-1 mb-2 z-20">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <span>● AV-1 [LOST &amp; FOUND]</span>
                    </span>
                    <span>1999 SHAQRA-NET</span>
                  </div>

                  {/* Central Login Content directly on CRT Glass */}
                  <div className="flex flex-col items-center text-center my-auto z-20 py-3 sm:py-6 crt-content-warmup">
                    {/* Word "مَحْفُوظ" with Amiri bold and distinct dot of 'ظ' */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#3d2719] mb-1 font-amiri tracking-tight">
                      مَحْفُوظ
                    </h1>

                    {/* Verified Subtitle */}
                    <div className="inline-block px-3 py-1 bg-[#ded5c6]/70 border border-[#b8aa99] rounded-md text-xs sm:text-sm font-medium text-[#5a4637] mb-3">
                      بوابة تسجيل الدخول — أمانات الحرم الجامعي
                    </div>

                    <p className="text-[11px] sm:text-xs text-[#6e594a] mb-4 sm:mb-5 max-w-md leading-relaxed px-2">
                      منظومة المعثورات والأمانات الرسمية لجامعة شقراء. يرجى تحديد صفة الدخول للانتقال إلى واجهة المنصة.
                    </p>

                    {/* Dual Bevel Login Buttons */}
                    <div className="w-full max-w-sm flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setIsStudentLoginModalOpen(true)}
                        className="flex-1 bevel-btn py-2.5 sm:py-3 px-3 sm:px-4 rounded font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-[#5a3e2b]" />
                        <span>دخول كطالب</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLogin('staff')}
                        className="flex-1 bevel-btn-brown py-2.5 sm:py-3 px-3 sm:px-4 rounded font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Briefcase className="w-4 h-4 text-[#FAF7F0]" />
                        <span>دخول كموظف أمانات</span>
                      </button>
                    </div>

                    <div className="mt-3 text-[10px] text-[#7a6758] font-mono">
                      جامعة شقراء — نظام الأمانات الكاثودي V1.0
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Control Panel (3 cols on desktop, compact on mobile) */}
              <div className="md:col-span-3 bg-[#20150e] p-3 sm:p-4 rounded-2xl border-2 border-[#38261a] flex flex-row md:flex-col justify-between items-center gap-3 sm:gap-5 shadow-inner">
                {/* Speaker Grille Louvers (Desktop) */}
                <div className="w-full space-y-1.5 hidden md:block opacity-60">
                  <div className="h-1 tv-grille-line rounded-full" />
                  <div className="h-1 tv-grille-line rounded-full" />
                  <div className="h-1 tv-grille-line rounded-full" />
                  <div className="h-1 tv-grille-line rounded-full" />
                  <div className="h-1 tv-grille-line rounded-full" />
                </div>

                {/* Big Channel Tuning Knob */}
                <div className="flex flex-col items-center">
                  <div className="text-[10px] text-[#9c8472] font-mono font-bold mb-1">TUNING</div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full tv-dial flex items-center justify-center relative cursor-pointer group">
                    <div className="w-1 h-4 sm:h-5 bg-[#c2b29f] rounded-full absolute top-1 group-hover:bg-amber-300 transition-colors" />
                    <div className="w-5 h-5 rounded-full bg-[#1b120c] border border-[#524032]" />
                  </div>
                  <span className="text-[9px] text-[#857060] font-mono mt-1">VHF / CH</span>
                </div>

                {/* Volume Knob */}
                <div className="flex flex-col items-center">
                  <div className="text-[10px] text-[#9c8472] font-mono font-bold mb-1">VOLUME</div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full tv-dial flex items-center justify-center relative cursor-pointer group">
                    <div className="w-1 h-3 sm:h-4 bg-[#c2b29f] rounded-full absolute top-1 group-hover:bg-amber-300 transition-colors" />
                    <div className="w-4 h-4 rounded-full bg-[#1b120c] border border-[#524032]" />
                  </div>
                  <span className="text-[9px] text-[#857060] font-mono mt-1">VOL / PUSH</span>
                </div>

                {/* Power Section with Glowing Red LED */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444,0_0_2px_#ffffff] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-[#e5a09c]">POWER</span>
                  </div>
                  <div className="px-2 py-0.5 bg-[#120b07] border border-[#3d2a1d] rounded text-[9px] font-mono text-[#a38e7d]">
                    ON / 220V
                  </div>
                </div>

                {/* Metal Badge */}
                <div className="w-full text-center hidden md:block pt-1 border-t border-[#3d2a1d]">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-[#947e6d]">
                    SHAQRA SOLID-STATE
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Student Login Modal (CRT Vintage Style) */}
          {isStudentLoginModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-md bg-gradient-to-b from-[#2e2017] via-[#3a291e] to-[#1c130d] p-3 sm:p-5 rounded-2xl border-4 border-[#170e08] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                {/* CRT Tube Frame */}
                <div className="bg-[#130d09] p-3 rounded-xl border-2 border-[#251a13] shadow-inner relative overflow-hidden">
                  <div className="crt-glass rounded-lg border-2 border-[#4d3a2c] p-4 text-right relative overflow-hidden">
                    <div className="absolute inset-0 scanlines-subtle pointer-events-none opacity-40" />

                    {/* Modal Title */}
                    <div className="flex items-center justify-between border-b border-[#a8988a]/40 pb-2 mb-3 z-10 relative">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#5a3e2b]">
                        <UserCheck className="w-4 h-4 text-[#5a3e2b]" />
                        <span>تسجيل دخول الطالب — بوابة مَحْفُوظ</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsStudentLoginModalOpen(false)}
                        className="bevel-btn p-1 rounded text-[#5a3e2b] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <form onSubmit={handleStudentLoginSubmit} className="space-y-3 z-10 relative">
                      <div>
                        <label className="block text-xs font-bold text-[#3d2719] mb-1">
                          الرقم الجامعي *
                        </label>
                        <input
                          type="text"
                          required
                          value={loginStudentIdInput}
                          onChange={(e) => setLoginStudentIdInput(e.target.value)}
                          placeholder="مثال: 442109876"
                          className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs font-mono text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3d2719] mb-1">
                          كلمة المرور *
                        </label>
                        <input
                          type="password"
                          required
                          value={loginPasswordInput}
                          onChange={(e) => setLoginPasswordInput(e.target.value)}
                          placeholder="كلمة مرور الحساب الجامعي"
                          className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                        />
                      </div>

                      <p className="text-[10px] text-[#7d6859] leading-tight">
                        * ملاحظة: يتم قبول أي مدخلات للتجربة، مع حفظ هوية الطالب «ناصر الدوسري» والرقم الجامعي في الجلسة.
                      </p>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#dfd5c6]/60">
                        <button
                          type="button"
                          onClick={() => setIsStudentLoginModalOpen(false)}
                          className="bevel-btn py-1.5 px-3 rounded text-xs text-[#5a3e2b] cursor-pointer"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="bevel-btn-brown py-1.5 px-4 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[#FAF7F0]"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>دخول للنظام</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
            VIEW 2: MAIN PORTAL VIEW (Full-Width Edge-to-Edge Container)
            ========================================================================= */
        <div className="w-full px-3 sm:px-6 py-3 sm:py-5 flex-1 flex flex-col z-20">
          
          {/* =========================================================================
              COMPACT RETRO BROWSER TOOLBAR (Retro Windows / Internet Explorer Style)
              ========================================================================= */}
          <div className="vintage-card rounded-xl overflow-hidden shadow-sm mb-3 border border-[#cfc2b2] w-full">
            {/* Title Bar (Ultra-slim ~26px) */}
            <div className="bg-gradient-to-r from-[#4a3222] via-[#5a3e2b] to-[#6d4d38] text-[#FAF7F0] px-2.5 py-1 flex items-center justify-between select-none border-b border-[#362214]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <Globe className="w-3.5 h-3.5 text-[#e8dec0] shrink-0" />
                <span className="truncate">محفوظ - أمانات الحرم الجامعي | جامعة شقراء</span>
              </div>
              
              {/* Window Controls: [ - ] [ □ ] [ ✕ ] */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  title="تصغير"
                  className="w-4 h-4 bg-[#dfd5c6] text-[#3e271b] border-t border-l border-white border-r border-b border-[#5a3e2b] flex items-center justify-center text-[9px] hover:bg-[#e8dec0] cursor-pointer"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <button
                  type="button"
                  title="تكبير"
                  className="w-4 h-4 bg-[#dfd5c6] text-[#3e271b] border-t border-l border-white border-r border-b border-[#5a3e2b] flex items-center justify-center text-[9px] hover:bg-[#e8dec0] cursor-pointer"
                >
                  <Square className="w-2.5 h-2.5" />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="إغلاق والعودة للبوابة"
                  className="w-4 h-4 bg-[#dfd5c6] text-[#3e271b] hover:bg-red-600 hover:text-white border-t border-l border-white border-r border-b border-[#5a3e2b] flex items-center justify-center text-[9px] cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Single Slim Row Toolbar (Buttons + Compact Address Bar) */}
            <div className="vintage-panel px-2 py-1 flex items-center gap-1.5 text-xs text-[#3e271b] overflow-x-auto scrollbar-none">
              {/* Browser Navigation Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  title="السابق"
                  className="bevel-btn px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5 opacity-75 hover:opacity-100 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3" />
                  <span className="hidden sm:inline">السابق</span>
                </button>
                <button
                  type="button"
                  title="التالي"
                  className="bevel-btn px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5 opacity-75 hover:opacity-100 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">التالي</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  title="إيقاف"
                  className="bevel-btn px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3 text-red-600" />
                  <span className="hidden md:inline">إيقاف</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('تم تحديث قائمة المعثورات بنجاح');
                  }}
                  title="تحديث"
                  className="bevel-btn px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-700" />
                  <span className="hidden md:inline">تحديث</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCollege('كل الكليات والمرافق');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  title="الرئيسية"
                  className="bevel-btn px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5 cursor-pointer"
                >
                  <Home className="w-3 h-3 text-[#5a3e2b]" />
                  <span className="hidden sm:inline">الرئيسية</span>
                </button>
              </div>

              {/* Vertical Subtle Divider */}
              <div className="w-[1px] h-3.5 bg-[#cfc2b2] mx-0.5 shrink-0" />

              {/* Compact Address Bar */}
              <div className="flex-1 flex items-center gap-1 min-w-[170px]">
                <span className="text-[10px] font-bold text-[#6d5747] shrink-0 font-mono hidden sm:inline">العنوان:</span>
                <div className="flex-1 bg-white border border-[#a89886] rounded px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
                  <Globe className="w-3 h-3 text-[#8c7768] shrink-0" />
                  <input
                    type="text"
                    readOnly
                    value="http://mahfooz.su.edu.sa/lost-and-found"
                    className="w-full text-[11px] font-mono text-[#3e271b] bg-transparent outline-none cursor-text select-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <header className="vintage-card rounded-xl p-3 sm:p-4 mb-4 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {/* Right Zone: Official Logo in neat framed container */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="w-14 h-14 sm:w-16 sm:h-16 vintage-panel p-1 rounded-xl flex items-center justify-center shrink-0 border-2 border-[#cfc2b2] shadow-sm bg-[#EFE7DA]">
                  <img
                    src="https://i.ibb.co/N2Zt9jGw/Gemini-Generated-Image-dp8ls1dp8ls1dp8l.jpg"
                    alt="شعار مَحْفُوظ"
                    className="max-w-full max-h-full object-contain logo-blend rounded-lg"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== window.location.origin + '/mahfooz_logo.png') {
                        target.src = '/mahfooz_logo.png';
                      }
                    }}
                  />
                </div>

                {/* Center / Brand Title: "مَحْفُوظ" in Amiri Bold + Subtitle */}
                <div className="text-right sm:text-right flex-1 sm:flex-initial">
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#3e271b] leading-tight font-amiri">
                    مَحْفُوظ
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-[#7d6859]">
                    جامعة شقراء — أمانات الحرم الجامعي
                  </p>
                </div>

                {/* Mobile logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="sm:hidden bevel-btn p-2 rounded text-[#5a3e2b]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Left Zone: Mini Retro CRT TV Student Badge + Logout */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {userRole === 'student' && (
                  <div
                    className="relative bg-gradient-to-b from-[#3a291e] via-[#2c1d14] to-[#1c120c] p-1.5 rounded-xl border-2 border-[#160d08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_6px_rgba(0,0,0,0.3)] flex items-center gap-2"
                    title="بطاقة بيانات الطالب الجامعي (شاشة كاثودية مصغرة)"
                  >
                    {/* Mini CRT Tube Screen */}
                    <div className="relative bg-[#EFE7DA] border-2 border-[#5a4231] rounded-lg px-2.5 py-1 shadow-[inset_0_2px_4px_rgba(40,25,15,0.3)] overflow-hidden flex flex-col justify-center text-right min-w-[105px]">
                      {/* Subtle CRT scanline overlay */}
                      <div className="absolute inset-0 scanlines-subtle pointer-events-none opacity-40" />

                      {/* Top line: Student Name */}
                      <div className="text-xs sm:text-sm font-bold text-[#4A3B32] font-amiri leading-tight z-10 whitespace-nowrap">
                        {studentName}
                      </div>

                      {/* Bottom line: Student ID */}
                      <div className="text-[10px] sm:text-[11px] font-bold text-[#8C6D58] font-mono leading-none z-10 mt-0.5 whitespace-nowrap">
                        {studentId}
                      </div>
                    </div>

                    {/* Mini CRT Knobs / Indicator */}
                    <div className="flex flex-col items-center justify-center gap-1 pl-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.8)]" title="متصل بالنظام" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1b120c] border border-[#524032]" />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  title="العودة لبوابة الدخول"
                  className="bevel-btn py-1.5 px-3 rounded-lg text-xs sm:text-sm text-[#5a3e2b] items-center gap-1.5 cursor-pointer font-bold flex shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج ➔</span>
                </button>
              </div>
            </div>
          </header>

          {/* Role-based Guidance / Stats View:
              - Student View: Free, prominent, unboxed greeting text in center + unified horizontal action bar.
              - Staff View: Shows staff control bar & 4 stats cards for managing inventory. */}
          {userRole === 'student' ? (
            <div className="py-4 sm:py-6 mb-5 flex flex-col items-center justify-center text-center w-full">
              {/* Free, prominent hero greeting without any enclosing box/border */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-[#3e271b] font-amiri tracking-tight mb-2 sm:mb-2.5 leading-snug flex items-center justify-center flex-wrap gap-x-2">
                <span>{typedPart1}</span>
                {typedPart2 && <span className="text-[#3e271b]">{typedPart2}</span>}
                {isCursorActive && (
                  <span className="inline-block w-2 sm:w-2.5 h-7 sm:h-9 bg-[#5a3e2b] animate-pulse rounded-xs align-middle" />
                )}
              </h2>
              <p
                className={`text-xs sm:text-sm md:text-base text-[#7d6859] font-medium leading-normal transition-all duration-700 ${
                  showSubtitle
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform translate-y-2 pointer-events-none'
                }`}
              >
                بوابة الأمانات الموحدة لكافة الكليات
              </p>

              {/* Unified Action Bar (Horizontal elegant rectangle directly below greeting) */}
              <div className="vintage-card rounded-xl p-2.5 sm:p-3 mt-4 sm:mt-5 border border-[#cfc2b2] shadow-sm flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {/* 1. Prominent brown button: [تسجيل معثور جديد] */}
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(true)}
                  className="bevel-btn-brown py-2 px-3.5 sm:px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow hover:brightness-105 transition-all"
                >
                  <Plus className="w-4 h-4 text-[#FAF7F0]" />
                  <span>تسجيل معثور جديد</span>
                </button>

                {/* 2. To its left: [سجل معثوراتي ومساهماتي] */}
                <button
                  type="button"
                  onClick={() => setIsMyItemsOpen(true)}
                  className="bevel-btn py-2 px-3 sm:px-3.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer text-[#3e271b] shadow hover:bg-[#eae0d2] transition-colors"
                  title="عرض المعثورات التي قمت برفعها ومتابعة الساعات المكتسبة"
                >
                  <ClipboardList className="w-4 h-4 text-[#5a3e2b]" />
                  <span>سجل معثوراتي ومساهماتي</span>
                  {myItemsList.length > 0 && (
                    <span className="bg-[#5a3e2b] text-[#FAF7F0] text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                      {myItemsList.length}
                    </span>
                  )}
                </button>

                {/* 3. To its left: Retro Inset/Bevel capsule: [⏳ الساعات التطوعية: X ساعة] */}
                <div
                  className="vintage-panel px-3 sm:px-3.5 py-1.5 rounded-lg border border-[#bfae9c] flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5a3e2b] shadow-inner bg-[#fcf8f0]"
                  title="رصيد الساعات التطوعية المكتسبة مقابل المعثورات المسلمة لأصحابها"
                >
                  <span className="text-sm">⏳</span>
                  <span>الساعات التطوعية:</span>
                  <span className="font-mono text-emerald-800 text-xs sm:text-sm font-black px-1.5 py-0.5 bg-[#e8f3ea] rounded border border-[#b2d8b8]">
                    {volunteerHours} ساعة
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Staff Guidance Header */}
              <div className="vintage-panel rounded-lg px-4 py-2.5 mb-3 flex items-center justify-between gap-3 text-center sm:text-right border border-[#d5c8b7] w-full flex-wrap">
                <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
                  <span className="text-sm sm:text-base font-bold text-[#4a3222] font-amiri tracking-wide">
                    ضاع منك شي؟ تراه في الحفظ والصون
                  </span>
                </div>
                <div className="flex items-center gap-2 mx-auto sm:mx-0">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(true)}
                    className="bevel-btn-brown py-1 px-3 rounded text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ تسجيل معثور جديد</span>
                  </button>
                  <span className="text-xs text-[#8c7768] font-mono">
                    لوحة تحكم موظف الأمانات
                  </span>
                </div>
              </div>

              {/* Quick Stats Summary (Staff Only) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 w-full">
                <div className="vintage-card p-2.5 rounded-lg text-center">
                  <div className="text-xs text-[#7d6859] mb-0.5">إجمالي المعثورات</div>
                  <div className="text-lg sm:text-xl font-bold text-[#3e271b] font-mono">{totalCount}</div>
                </div>
                <div className="vintage-card p-2.5 rounded-lg text-center bg-[#f2f8f3]">
                  <div className="text-xs text-[#2b6635] mb-0.5">محفوظ بالأمانات</div>
                  <div className="text-lg sm:text-xl font-bold text-[#1e5927] font-mono">{inCustodyCount}</div>
                </div>
                <div className="vintage-card p-2.5 rounded-lg text-center">
                  <div className="text-xs text-[#7d6859] mb-0.5">تم تسليمها</div>
                  <div className="text-lg sm:text-xl font-bold text-[#5a3e2b] font-mono">{deliveredCount}</div>
                </div>
                <div className="vintage-card p-2.5 rounded-lg text-center bg-[#fdf5ed]">
                  <div className="text-xs text-[#8c4b27] mb-0.5">بلاغات «صَوْن» الميدانية</div>
                  <div className="text-lg sm:text-xl font-bold text-[#8c4b27] font-mono flex items-center justify-center gap-1">
                    <span>{agentTickets.length}</span>
                    {pendingAgentTicketsCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold animate-pulse">
                        {pendingAgentTicketsCount} معلق
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Staff Tab Selector Bar */}
              <div className="flex items-center gap-2 mb-4 w-full border-b-2 border-[#cfc2b2] pb-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setStaffViewTab('agent_tickets')}
                  className={`bevel-btn py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    staffViewTab === 'agent_tickets'
                      ? 'bevel-btn-brown text-white shadow-md'
                      : 'text-[#5a3e2b] hover:bg-[#ede1d1]'
                  }`}
                >
                  <Bot className="w-4 h-4 text-amber-200" />
                  <span>🤖 وارد بلاغات «محفوظ وصَوْن» الميدانية</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                      staffViewTab === 'agent_tickets'
                        ? 'bg-[#FAF7F0] text-[#5a3e2b]'
                        : 'bg-[#e5dcd0] text-[#5a3e2b]'
                    }`}
                  >
                    {agentTickets.length}
                  </span>
                  {pendingAgentTicketsCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                      {pendingAgentTicketsCount} بانتظار التوجه
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStaffViewTab('inventory')}
                  className={`bevel-btn py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    staffViewTab === 'inventory'
                      ? 'bevel-btn-brown text-white shadow-md'
                      : 'text-[#5a3e2b] hover:bg-[#ede1d1]'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>📦 سجل المعثورات العام والتسليم</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                      staffViewTab === 'inventory'
                        ? 'bg-[#FAF7F0] text-[#5a3e2b]'
                        : 'bg-[#e5dcd0] text-[#5a3e2b]'
                    }`}
                  >
                    {items.length}
                  </span>
                </button>
              </div>
            </>
          )}

          {/* If Officer is on Agent Tickets Tab */}
          {userRole === 'staff' && staffViewTab === 'agent_tickets' ? (
            <div className="w-full space-y-4 mb-6">
              <div className="vintage-card p-4 sm:p-5 rounded-2xl border-2 border-[#8c4b27]/40 bg-[#FFFDF9] shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5dcd0] pb-3.5">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#3e271b] font-amiri flex items-center gap-2">
                      <Bot className="w-5 h-5 text-[#8c4b27]" />
                      <span>وارد بلاغات «محفوظ وصَوْن» الميدانية</span>
                    </h3>
                    <p className="text-xs text-[#7d6859] mt-0.5">
                      تذاكر وبلاغات واردة من الوكيل «صَوْن» بعد استيفاء بيانات الطالب للتحقق الميداني وحفظها بصندوق الأمانات
                    </p>
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setAgentTicketsFilter('all')}
                      className={`py-1.5 px-3 rounded-lg font-bold cursor-pointer transition-colors ${
                        agentTicketsFilter === 'all'
                          ? 'bevel-btn-brown text-white'
                          : 'bevel-btn text-[#5a3e2b]'
                      }`}
                    >
                      الكل ({agentTickets.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgentTicketsFilter('pending')}
                      className={`py-1.5 px-3 rounded-lg font-bold cursor-pointer transition-colors ${
                        agentTicketsFilter === 'pending'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bevel-btn text-amber-800'
                      }`}
                    >
                      ⏳ بانتظار التوجه ({pendingAgentTicketsCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgentTicketsFilter('stored')}
                      className={`py-1.5 px-3 rounded-lg font-bold cursor-pointer transition-colors ${
                        agentTicketsFilter === 'stored'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bevel-btn text-emerald-800'
                      }`}
                    >
                      ✅ تم الحفظ ({storedAgentTicketsCount})
                    </button>
                  </div>
                </div>

                {/* Tickets Grid */}
                {filteredAgentTickets.length === 0 ? (
                  <div className="py-12 text-center text-[#7d6859]">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-2.5 text-[#bfae9c]" />
                    <p className="text-sm font-bold text-[#3e271b]">لا توجد بلاغات تطابق الفلتر المحدد حالياً</p>
                    <p className="text-xs text-[#8c7768] mt-1">تُدرج هنا تلقائياً البلاغات الميدانية الجديدة المرفوعة من قِبل الطلاب عبر الوكيل «صَوْن»</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                    {filteredAgentTickets.map((ticket) => {
                      const isPending = ticket.taskStatus === 'بانتظار التوجه الميداني';
                      return (
                        <div
                          key={ticket.id}
                          className={`vintage-card p-3.5 sm:p-4 rounded-xl border-2 transition-all flex flex-col justify-between gap-3 shadow-xs ${
                            isPending
                              ? 'border-amber-300 bg-amber-50/20 hover:border-amber-500'
                              : 'border-[#cfc2b2] bg-white hover:border-[#5a3e2b]'
                          }`}
                        >
                          <div>
                            {/* Card Header: Ref, Time, Task Status */}
                            <div className="flex items-start justify-between gap-2 border-b border-[#f0e8dc] pb-2 mb-2.5">
                              <div>
                                <div className="text-[11px] font-mono font-bold text-[#8c4b27] flex items-center gap-1.5">
                                  <Tag className="w-3 h-3 text-[#8c4b27]" />
                                  <span>{ticket.refNumber}</span>
                                </div>
                                <div className="text-[10px] text-[#8c7768] flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3 text-[#8c7768]" />
                                  <span>{ticket.date} — {ticket.time}</span>
                                </div>
                              </div>

                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                                  isPending
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                }`}
                              >
                                {isPending ? (
                                  <>
                                    <Clock className="w-3 h-3 text-amber-700 animate-spin-slow" />
                                    <span>بانتظار التوجه الميداني</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                    <span>تم الحفظ بالأمانات</span>
                                  </>
                                )}
                              </span>
                            </div>

                            {/* Card Body */}
                            <div className="flex items-start gap-3">
                              <div className="w-14 h-14 rounded-xl bg-[#EFE7D8] border border-[#d5c8b7] shrink-0 flex items-center justify-center p-1.5 shadow-2xs">
                                <div
                                  className="w-full h-full flex items-center justify-center"
                                  dangerouslySetInnerHTML={{ __html: getItemSvg(ticket) }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-[#3e271b] font-amiri leading-snug truncate" title={ticket.name}>
                                  {ticket.name}
                                </h4>
                                <div className="text-xs font-bold text-[#8c4b27] flex items-center gap-1 mt-1">
                                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#8c4b27]" />
                                  <span className="truncate">{ticket.college} — {ticket.exactLocation || ticket.location}</span>
                                </div>
                                {ticket.studentPhone && (
                                  <div className="text-[11px] text-[#5a3e2b] flex items-center gap-1 mt-0.5 font-mono">
                                    <Phone className="w-3 h-3 text-[#7d6859]" />
                                    <span>جوال الطالب: {ticket.studentPhone}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            <div className="bg-[#FAF7F0] p-2.5 rounded-lg border border-[#e5dcd0] mt-2.5 text-xs text-[#5a3e2b] leading-relaxed">
                              <span className="text-[#8c7768] font-bold block text-[10px] mb-0.5">تفاصيل ووصف الغرض:</span>
                              <p className="line-clamp-2">{ticket.description}</p>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#f0e8dc] flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveModalItem(ticket);
                                setClaimSubmitted(false);
                              }}
                              className="bevel-btn py-1.5 px-2.5 rounded-lg text-xs font-bold text-[#5a3e2b] hover:text-[#3e271b] cursor-pointer flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>معاينة البطاقة</span>
                            </button>

                            {isPending ? (
                              <button
                                type="button"
                                onClick={() => handleReceiveAndStoreInSafe(ticket)}
                                className="bevel-btn-brown py-1.5 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow hover:brightness-105 transition-all"
                                title="تأكيد التوجه الميداني واستلام المعثور وحفظه في صندوق الأمانات"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                <span>[تم الاستلام والحفظ في الصندوق]</span>
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 py-1 px-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span>محفوظ في صندوق الأمانات</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* If on inventory tab, and there are pending tickets, show prompt banner */}
              {userRole === 'staff' && pendingAgentTicketsCount > 0 && (
                <div className="vintage-panel p-2.5 mb-3.5 rounded-xl border border-amber-300 bg-amber-50/80 flex items-center justify-between gap-2 text-xs flex-wrap">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <Clock className="w-4 h-4 text-amber-700 animate-spin-slow" />
                    <span>تنبيه: يوجد {pendingAgentTicketsCount} بلاغ ميداني جديد محال من الوكيل «صَوْن» بانتظار التوجه.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStaffViewTab('agent_tickets')}
                    className="bevel-btn-brown py-1 px-3 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    معاينة وارد صَوْن ➔
                  </button>
                </div>
              )}

          {/* Search & Filters Section */}
          <section className="vintage-card rounded-xl p-3 sm:p-4 mb-4 w-full">
            <div className="flex flex-col md:flex-row gap-3 mb-3">
              {/* Live search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8c7768] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، الموقع، الوصف، أو الرقم المرجعي..."
                  className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded-lg pr-9 pl-3 py-2 text-xs sm:text-sm text-[#3e271b] placeholder:text-[#9e8b7d] focus:outline-none focus:border-[#5a3e2b]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7768] hover:text-[#3e271b] text-xs font-bold"
                  >
                    مسح
                  </button>
                )}
              </div>

              {/* College selector dropdown */}
              <div className="w-full md:w-64">
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                >
                  {COLLEGES_LIST.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              {/* Quick AI Assistant Button (Only for students) */}
              {userRole === 'student' && (
                <button
                  type="button"
                  onClick={() => setIsAssistantOpen(true)}
                  title="مساعد المفقودات الذكي"
                  className="bevel-btn py-2 px-3.5 rounded-lg text-xs font-bold text-[#5a3e2b] flex items-center justify-center gap-1.5 whitespace-nowrap hover:bg-[#ede3d4] cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#8c4b27]" />
                  <span>مساعد المفقودات</span>
                </button>
              )}
            </div>

            {/* Category Filter Tabs with Counters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`py-1.5 px-3 rounded font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'all'
                    ? 'bevel-btn-brown font-bold'
                    : 'bevel-btn text-[#5a3e2b]'
                }`}
              >
                الكل ({categoryCounts.all})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('electronics')}
                className={`py-1.5 px-3 rounded font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'electronics'
                    ? 'bevel-btn-brown font-bold'
                    : 'bevel-btn text-[#5a3e2b]'
                }`}
              >
                إلكترونيات ({categoryCounts.electronics})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('documents')}
                className={`py-1.5 px-3 rounded font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'documents'
                    ? 'bevel-btn-brown font-bold'
                    : 'bevel-btn text-[#5a3e2b]'
                }`}
              >
                وثائق وبطاقات ({categoryCounts.documents})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('belongings')}
                className={`py-1.5 px-3 rounded font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'belongings'
                    ? 'bevel-btn-brown font-bold'
                    : 'bevel-btn text-[#5a3e2b]'
                }`}
              >
                مقتنيات ({categoryCounts.belongings})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('keys')}
                className={`py-1.5 px-3 rounded font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'keys'
                    ? 'bevel-btn-brown font-bold'
                    : 'bevel-btn text-[#5a3e2b]'
                }`}
              >
                مفاتيح ({categoryCounts.keys})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('tools')}
                className={`py-1.5 px-3 rounded font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'tools'
                    ? 'bevel-btn-brown font-bold'
                    : 'bevel-btn text-[#5a3e2b]'
                }`}
              >
                أدوات ({categoryCounts.tools})
              </button>
            </div>
          </section>

          {/* Cards Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
          <main className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="vintage-card rounded-xl p-8 text-center my-6">
                <AlertCircle className="w-10 h-10 text-[#8c7768] mx-auto mb-2 opacity-60" />
                <h3 className="text-base font-bold text-[#5a3e2b] mb-1">لم يتم العثور على أية معثورات تطابق البحث</h3>
                <p className="text-xs text-[#8c7768] mb-4">جرّب تغيير كلمات البحث أو اختيار كلية أخرى أو فئة تصنيف مختلفة.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCollege('كل الكليات والمرافق');
                    setSelectedCategory('all');
                  }}
                  className="bevel-btn py-1.5 px-4 rounded text-xs font-bold"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 w-full">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="vintage-card rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
                  >
                    <div>
                      {/* Item Vector SVG with Bevel Frame */}
                      <div className="relative aspect-[16/10] bg-[#EFE7D8] overflow-hidden border-b-2 border-[#cfc2b2] flex items-center justify-center">
                        <div
                          className="w-full h-full flex items-center justify-center select-none"
                          dangerouslySetInnerHTML={{ __html: getItemSvg(item) }}
                        />

                        {/* Top Category Tag */}
                        <div className="absolute top-2 right-2 bg-[#5a3e2b]/90 text-[#FAF7F0] text-[11px] font-medium px-2 py-0.5 rounded shadow z-10">
                          {item.categoryLabel}
                        </div>

                        {/* Ref number chip */}
                        <div className="absolute bottom-2 left-2 bg-[#FAF7F0]/90 text-[#3e271b] text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#cfc2b2] z-10">
                          {item.refNumber}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-3">
                        {/* Title */}
                        <h3 className="font-bold text-sm text-[#3e271b] line-clamp-1 mb-2">
                          {item.name}
                        </h3>

                        {/* College & Location */}
                        <div className="space-y-1 mb-3 text-xs text-[#6e5849]">
                          <div className="flex items-start gap-1.5 line-clamp-1">
                            <Building2 className="w-3.5 h-3.5 text-[#5a3e2b] shrink-0 mt-0.5" />
                            <span>{item.college}</span>
                          </div>
                          <div className="flex items-start gap-1.5 line-clamp-1 text-[11px] text-[#8c7768]">
                            <MapPin className="w-3.5 h-3.5 text-[#8c7768] shrink-0 mt-0.5" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#8c7768]">
                            <Calendar className="w-3.5 h-3.5 text-[#8c7768] shrink-0" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status & Action */}
                    <div className="px-3 pb-3 pt-2 border-t border-[#e5dcd0] flex items-center justify-between gap-2">
                      {/* Status badge */}
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          item.status === 'محفوظ بالأمانات'
                            ? 'badge-mahfooz'
                            : 'badge-delivered'
                        }`}
                      >
                        {item.status}
                      </span>

                      {/* Details & Claim button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalItem(item);
                          setClaimSubmitted(false);
                        }}
                        className="bevel-btn py-1 px-2.5 rounded text-xs font-bold text-[#452c1e] hover:text-[#1f1712] cursor-pointer"
                      >
                        [ تفاصيل واستلام ]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
          </>
        )}

          {/* Footer */}
          <footer className="mt-8 pt-4 border-t border-[#dfd5c6] text-center text-xs text-[#8c7768]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>جامعة شقراء — عمادة شؤون الطلاب — وحدة المفقودات والأمانات الجامعية © ١٤٤٧ هـ</span>
              <span className="font-amiri font-bold text-[#5a3e2b]">مَحْفُوظ | في الحفظ والصون دائماً</span>
            </div>
          </footer>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ITEM DETAILS & CLAIM MODAL
          ========================================================================= */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="vintage-card w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="vintage-panel p-3 sm:p-4 border-b border-[#cfc2b2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5a3e2b]" />
                <h2 className="text-base sm:text-lg font-bold text-[#3e271b]">تفاصيل المعثور</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="bevel-btn p-1 rounded text-[#5a3e2b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 max-h-[75vh] overflow-y-auto space-y-4">
              {/* Item image & Ref lockup */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                <div className="w-32 h-32 sm:w-36 sm:h-36 vintage-panel rounded-lg overflow-hidden shrink-0 border border-[#cfc2b2] flex items-center justify-center bg-[#EFE7D8]">
                  <div
                    className="w-full h-full flex items-center justify-center select-none"
                    dangerouslySetInnerHTML={{ __html: getItemSvg(activeModalItem) }}
                  />
                </div>
                <div className="flex-1 space-y-1.5 text-center sm:text-right">
                  <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#EFE7DA] text-[#5a3e2b] border border-[#d5c8b7]">
                    الرقم المرجعي: <span className="font-mono">{activeModalItem.refNumber}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#3e271b]">
                    {activeModalItem.name}
                  </h3>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        activeModalItem.status === 'محفوظ بالأمانات'
                          ? 'badge-mahfooz'
                          : 'badge-delivered'
                      }`}
                    >
                      {activeModalItem.status}
                    </span>
                    <span className="text-xs text-[#7d6859]">
                      التصنيف: {activeModalItem.categoryLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Specs Table */}
              <div className="vintage-panel rounded-lg p-3 text-xs space-y-2 border border-[#d5c8b7]">
                <div className="flex justify-between py-1 border-b border-[#dfd5c6]">
                  <span className="text-[#7d6859]">الكلية المسؤولة:</span>
                  <span className="font-bold text-[#3e271b]">{activeModalItem.college}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dfd5c6]">
                  <span className="text-[#7d6859]">موقع العثور عليه:</span>
                  <span className="font-bold text-[#3e271b]">{activeModalItem.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dfd5c6]">
                  <span className="text-[#7d6859]">تاريخ ووقت الرصد:</span>
                  <span className="font-bold text-[#3e271b]">{activeModalItem.date} — {activeModalItem.time}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dfd5c6]">
                  <span className="text-[#7d6859]">مكتب تسليم الأمانات:</span>
                  <span className="font-bold text-[#3e271b]">{activeModalItem.custodianOffice}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#7d6859]">المشرف المسؤول:</span>
                  <span className="font-bold text-[#3e271b]">{activeModalItem.custodianName} ({activeModalItem.contactExt})</span>
                </div>
              </div>

              {/* Item Description */}
              <div>
                <h4 className="text-xs font-bold text-[#5a3e2b] mb-1">وصف المعثور والعلامات الفارقة:</h4>
                <p className="text-xs text-[#6e5849] leading-relaxed bg-[#FAF7F0] p-2.5 rounded border border-[#e5dcd0]">
                  {activeModalItem.description}
                </p>
              </div>

              {/* Instructions for Claim */}
              <div className="bg-[#FAF7F0] p-3 rounded-lg border-2 border-[#5a3e2b]/30">
                <h4 className="text-xs font-bold text-[#5a3e2b] mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#5a3e2b]" />
                  <span>طريقة استلام المعثور:</span>
                </h4>
                <p className="text-[11px] text-[#6e5849] leading-relaxed">
                  تفضل بزيارة <strong>{activeModalItem.custodianOffice}</strong> مع إحضار بطاقتك الجامعية أو الهوية الوطنية، وتقديم ما يثبت ملكيتك للغرض (كلمة مرور، علامة فارقة، أو محتويات دقيقة).
                </p>
              </div>

              {claimSubmitted ? (
                <div className="p-3 bg-[#e8f3ea] border border-[#a3c9a8] rounded-lg text-center space-y-1">
                  <div className="text-xs font-bold text-[#1e5927] flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>تم تسجيل إشعار استفسارك لدى موظف الأمانات بنجاح!</span>
                  </div>
                  <div className="text-[11px] text-[#2b6635]">
                    يمكنك التوجه مباشرة للمكتب لاستلامه مصطحباً رقم المرجع [{activeModalItem.refNumber}].
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer (Role-based actions for Staff vs Student) */}
            <div className="vintage-panel p-3 border-t border-[#cfc2b2] flex items-center justify-between gap-2 flex-wrap">
              {userRole === 'staff' ? (
                <>
                  {/* Staff Administrative Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(activeModalItem)}
                      disabled={isUpdatingStatus}
                      className="bevel-btn py-1.5 px-2.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[#3e271b]"
                      title="تحديث حالة المعثور بين محفوظ بالأمانات وتم التسليم"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingStatus ? 'animate-spin' : ''}`} />
                      <span>
                        {isUpdatingStatus
                          ? 'جاري التحديث...'
                          : activeModalItem.status === 'محفوظ بالأمانات'
                          ? 'تعديل إلى: تم التسليم'
                          : 'إعادة إلى: محفوظ بالأمانات'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setItemToDelete(activeModalItem)}
                      className="bevel-btn py-1.5 px-2.5 rounded text-xs font-bold flex items-center gap-1 cursor-pointer text-red-700 hover:text-red-900"
                      title="حذف هذا المعثور نهائياً"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      <span>حذف</span>
                    </button>
                  </div>

                  {/* Staff Print, Claim & Close */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="bevel-btn py-1.5 px-3 rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة إشعار</span>
                    </button>

                    {!claimSubmitted && (
                      <button
                        type="button"
                        onClick={async () => {
                          setClaimSubmitted(true);
                          if (isSupabaseConfigured && supabase && activeModalItem) {
                            try {
                              await supabase.from('claim_requests').insert([
                                {
                                  ref_number: activeModalItem.refNumber,
                                  item_id: activeModalItem.id.startsWith('item-') ? null : activeModalItem.id,
                                  student_notes: 'طلب استلام ومراجعة من واجهة المنصة'
                                }
                              ]);
                            } catch (e) {
                              console.error('Claim record error:', e);
                            }
                          }
                        }}
                        className="bevel-btn-brown py-1.5 px-4 rounded text-xs font-bold cursor-pointer"
                      >
                        تقديم طلب مراجعة واستلام
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveModalItem(null)}
                      className="bevel-btn py-1.5 px-3 rounded text-xs text-[#5a3e2b] cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                </>
              ) : (
                /* Student Role-based Actions */
                activeModalItem.reportedByStudent ? (
                  /* Item previously uploaded by this student */
                  <div className="flex items-center justify-between w-full gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(activeModalItem)}
                        className="bevel-btn py-1.5 px-3 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[#3e271b]"
                        title="تعديل بيانات البلاغ"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#5a3e2b]" />
                        <span>تعديل البيانات</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setItemToDelete(activeModalItem)}
                        className="bevel-btn py-1.5 px-3 rounded text-xs font-bold flex items-center gap-1 cursor-pointer text-red-700 hover:text-red-900 border-red-300"
                        title="حذف هذا البلاغ"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span>حذف البلاغ</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#7d6859] hidden sm:inline">
                        (معثور مسجل بواسطة هذا الحساب)
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveModalItem(null)}
                        className="bevel-btn py-1.5 px-3 rounded text-xs text-[#5a3e2b] cursor-pointer"
                      >
                        إغلاق
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Regular item viewed by a student */
                  <div className="flex items-center justify-end w-full gap-2">
                    {!claimSubmitted && (
                      <button
                        type="button"
                        onClick={async () => {
                          setClaimSubmitted(true);
                          if (isSupabaseConfigured && supabase && activeModalItem) {
                            try {
                              await supabase.from('claim_requests').insert([
                                {
                                  ref_number: activeModalItem.refNumber,
                                  item_id: activeModalItem.id.startsWith('item-') ? null : activeModalItem.id,
                                  student_notes: 'طلب استلام ومراجعة من واجهة المنصة'
                                }
                              ]);
                            } catch (e) {
                              console.error('Claim record error:', e);
                            }
                          }
                        }}
                        className="bevel-btn-brown py-1.5 px-4 rounded text-xs font-bold cursor-pointer"
                      >
                        تقديم طلب مراجعة واستلام
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveModalItem(null)}
                      className="bevel-btn py-1.5 px-3 rounded text-xs text-[#5a3e2b] cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: REGISTER NEW LOST ITEM (Real Form)
          ========================================================================= */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="vintage-card w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="vintage-panel p-3 sm:p-4 border-b border-[#cfc2b2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#5a3e2b]" />
                <h2 className="text-base sm:text-lg font-bold text-[#3e271b]">تسجيل معثور جديد في الأمانات</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="bevel-btn p-1 rounded text-[#5a3e2b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="p-4 sm:p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              {/* Ownership Selection Capsules */}
              <div>
                <label className="block text-xs font-bold text-[#3e271b] mb-1.5">
                  صفة المعثور ونوع البلاغ *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOwnershipType('personal');
                      setCapturedImage(null);
                    }}
                    className={`p-2.5 rounded-xl border-2 text-right transition-all flex items-start gap-2.5 cursor-pointer ${
                      ownershipType === 'personal'
                        ? 'bg-[#f4ece0] border-[#5a3e2b] shadow-xs ring-1 ring-[#5a3e2b]'
                        : 'bg-[#FAF7F0] border-[#cfc2b2] hover:bg-[#f0e8dc]'
                    }`}
                  >
                    <span className="text-lg">👤</span>
                    <div>
                      <div className="text-xs font-bold text-[#3e271b]">المعثور لي (مفقود شخصي)</div>
                      <div className="text-[10px] text-[#7d6859] leading-tight mt-0.5">
                        رفع بلاغ للمشرف الميداني للبحث عنه (0 ساعات تطوعية)
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOwnershipType('contribution')}
                    className={`p-2.5 rounded-xl border-2 text-right transition-all flex items-start gap-2.5 cursor-pointer ${
                      ownershipType === 'contribution'
                        ? 'bg-[#e8f3ea] border-emerald-700 shadow-xs ring-1 ring-emerald-700'
                        : 'bg-[#FAF7F0] border-[#cfc2b2] hover:bg-[#f0e8dc]'
                    }`}
                  >
                    <span className="text-lg">🤝</span>
                    <div>
                      <div className="text-xs font-bold text-[#1e5927]">المعثور لغيري (مساهمة تطوعية)</div>
                      <div className="text-[10px] text-[#2b6635] leading-tight mt-0.5">
                        توثيق غرض عثرت عليه وتسليمه للأمانات (+2 ساعات تطوعية)
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mandatory Camera / Upload Field for Volunteer Contribution */}
              {ownershipType === 'contribution' && (
                <div className="p-3 bg-[#f2f8f3] border-2 border-dashed border-[#9dc3a3] rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-[#1e5927] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-emerald-800" />
                      <span>تصوير المعثور أو رفع صورة (إلزامي للمساهمة) *</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-normal">كاميرا الجوال أو المعرض</span>
                  </label>

                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="file"
                      id="camera-item-input"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageCapture}
                      className="hidden"
                    />
                    <label
                      htmlFor="camera-item-input"
                      className="bevel-btn-brown py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[#FAF7F0] shrink-0"
                    >
                      <Camera className="w-4 h-4" />
                      <span>📷 التقاط صورة أو اختيار ملف</span>
                    </label>

                    {capturedImage ? (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-[#5a3e2b] shadow-sm shrink-0 bg-white">
                        <img src={capturedImage} alt="معاينة المعثور" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setCapturedImage(null)}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-0.5 text-[9px] cursor-pointer"
                          title="حذف الصورة"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#4b6a51]">
                        لم تلتقط صورة بعد. تصوير المعثور إلزامي لاحتساب الساعات وتوثيق الأمانة.
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#3e271b] mb-1">
                  اسم المعثور / الغرض *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="مثال: سماعة رأس، مفاتيح سيارة، بطاقة طالب..."
                  className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3e271b] mb-1">
                    تصنيف المعثور *
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                  >
                    <option value="electronics">إلكترونيات</option>
                    <option value="documents">وثائق وبطاقات</option>
                    <option value="belongings">مقتنيات شخصية</option>
                    <option value="keys">مفاتيح</option>
                    <option value="tools">أدوات ومستلزمات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3e271b] mb-1">
                    الكلية / المرفق *
                  </label>
                  <select
                    value={newItemCollege}
                    onChange={(e) => {
                      const col = e.target.value;
                      setNewItemCollege(col);
                      const officer = getOfficerForCollege(col);
                      if (officer) {
                        setNewItemCustodian(officer.custodianName);
                        setNewItemExt(officer.contactExt);
                      }
                    }}
                    className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                  >
                    {COLLEGES_NAMES.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3e271b] mb-1">
                  الموقع الدقيق للعثور عليه *
                </label>
                <input
                  type="text"
                  required
                  value={newItemLocation}
                  onChange={(e) => setNewItemLocation(e.target.value)}
                  placeholder="مثال: القاعة 101، معمل الكيمياء، مواقف البوابة الشرقية..."
                  className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3e271b] mb-1">
                  وصف دقيق وعلامات فارقة
                </label>
                <textarea
                  rows={3}
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="اللون، الماركة، الخدوش أو العلامات المميزة لتأكيد الملكية..."
                  className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                />
              </div>

              {/* Custodian & Ext (Auto-filled & Readonly with Vintage Inset Styling) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3e271b] mb-1 flex items-center justify-between">
                    <span>موظف الأمانات المستلم</span>
                    <span className="text-[10px] text-[#7d6859] font-normal flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-[#5a3e2b]" /> تعيين آلي مقفل
                    </span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    tabIndex={-1}
                    value={newItemCustodian}
                    title="حقل قراءة فقط مقفل — يتم تحديثه تلقائياً حسب الكلية المختارة"
                    className="w-full bg-[#eee7db] border-2 border-[#bfae9c] rounded px-3 py-1.5 text-xs text-[#3e271b] font-bold shadow-inner cursor-not-allowed select-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3e271b] mb-1 flex items-center justify-between">
                    <span>رقم التحويلة / التواصل</span>
                    <span className="text-[10px] text-[#7d6859] font-normal flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-[#5a3e2b]" /> تحويلة رسمية
                    </span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    tabIndex={-1}
                    value={newItemExt}
                    title="حقل قراءة فقط مقفل — يتم تحديثه تلقائياً حسب الكلية المختارة"
                    className="w-full bg-[#eee7db] border-2 border-[#bfae9c] rounded px-3 py-1.5 text-xs text-[#3e271b] font-mono font-bold shadow-inner cursor-not-allowed select-all"
                  />
                </div>
              </div>

              {/* Form Action */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#dfd5c6]">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="bevel-btn py-1.5 px-3 rounded text-xs text-[#5a3e2b] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bevel-btn-brown py-1.5 px-4 rounded text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري الحفظ في السحاب...' : 'تأكيد وحفظ المعثور في الأمانات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DELETE CONFIRMATION DIALOG (Safe Delete)
          ========================================================================= */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="vintage-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="vintage-panel p-3 sm:p-4 border-b border-[#cfc2b2] flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 font-bold">
                <Trash2 className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold">تأكيد حذف المعثور</h3>
              </div>
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="bevel-btn p-1 rounded text-[#5a3e2b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs text-[#3e271b] leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا المعثور نهائياً من منصة «مَحْفُوظ» وقاعدة البيانات؟
              </p>

              <div className="vintage-panel p-3 rounded-lg border border-[#cfc2b2] text-xs space-y-1">
                <div className="font-bold text-[#3e271b]">{itemToDelete.name}</div>
                <div className="text-[11px] text-[#7d6859]">الرقم المرجعي: <span className="font-mono font-bold text-[#5a3e2b]">{itemToDelete.refNumber}</span></div>
                <div className="text-[11px] text-[#7d6859]">الموقع: {itemToDelete.college} - {itemToDelete.location}</div>
              </div>

              <p className="text-[11px] text-red-600 font-medium">
                ⚠️ تنبيه: لا يمكن التراجع عن هذه العملية بعد إتمام الحذف.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#dfd5c6]">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  className="bevel-btn py-1.5 px-3 rounded text-xs text-[#5a3e2b] cursor-pointer"
                >
                  تراجع وإلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className={`bevel-btn py-1.5 px-4 rounded text-xs font-bold text-red-700 hover:text-red-900 border-red-400 cursor-pointer flex items-center gap-1.5 ${
                    isDeleting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>{isDeleting ? 'جاري الحذف...' : 'نعم، تأكيد الحذف'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: MY ITEMS & VOLUNTEER CONTRIBUTIONS (Gamification & History)
          ========================================================================= */}
      {isMyItemsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="vintage-card w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="vintage-panel p-3 sm:p-4 border-b border-[#cfc2b2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#5a3e2b]" />
                <h2 className="text-base sm:text-lg font-bold text-[#3e271b]">
                  سجل معثوراتي ومساهماتي التطوعية
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsMyItemsOpen(false)}
                className="bevel-btn p-1 rounded text-[#5a3e2b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 max-h-[75vh] overflow-y-auto space-y-4">
              {/* Gamification Summary Banner */}
              <div className="vintage-panel p-3.5 sm:p-4 rounded-xl border-2 border-[#5a3e2b]/30 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fdfbf7]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                    ⏳
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#7d6859]">إجمالي الساعات المعتمدة في سجلك:</div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-800 font-mono">
                      {volunteerHours} ساعة تطوعية
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#6d5747] text-center sm:text-left leading-relaxed sm:max-w-xs bg-white/70 p-2 rounded-lg border border-[#e5dcd0]">
                  💡 <strong>نظام الحوافز:</strong> كل معثور تسلّمه للأمانات ويصل لصاحبه بنجاح يمنحك <strong>ساعتين تطوعية معتمدة (+2)</strong> في سجلك المهاري بالجامعة.
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#dfd5c6] pb-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-[#3e271b] flex items-center gap-1.5">
                    <span>قائمة المعثورات المسجلة بواسطتك</span>
                    <span className="text-xs font-mono text-[#7d6859]">({myItemsList.length})</span>
                  </h3>
                </div>

                {myItemsList.length === 0 ? (
                  <div className="vintage-panel p-6 rounded-xl text-center space-y-2 border border-[#dfd5c6]">
                    <div className="text-3xl">📦</div>
                    <div className="text-xs font-bold text-[#5a3e2b]">لم تقم بتسجيل أية معثورات حتى الآن</div>
                    <p className="text-[11px] text-[#7d6859] max-w-sm mx-auto">
                      عند عثورك على أي مفقود في الحرم الجامعي، قم بتسجيله وتسليمه للأمانات للمساهمة في حفظ أمانات زملائك واكتساب ساعات تطوعية.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMyItemsOpen(false);
                        setIsRegisterOpen(true);
                      }}
                      className="bevel-btn-brown py-1.5 px-4 rounded text-xs font-bold mt-2 cursor-pointer inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>تسجيل أول معثور الآن</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {myItemsList.map((item) => (
                      <div
                        key={item.id}
                        className="vintage-panel p-3 rounded-xl border border-[#cfc2b2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#5a3e2b] transition-colors"
                      >
                        {/* Item Details */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#cfc2b2] shrink-0 bg-[#EFE7D8] flex items-center justify-center">
                            <div
                              className="w-full h-full flex items-center justify-center select-none"
                              dangerouslySetInnerHTML={{ __html: getItemSvg(item) }}
                            />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="text-xs sm:text-sm font-bold text-[#3e271b] truncate">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#7d6859] flex-wrap">
                              <span className="font-mono font-bold text-[#5a3e2b]">{item.refNumber}</span>
                              <span>•</span>
                              <span>{item.college}</span>
                              <span>•</span>
                              <span>{item.date}</span>
                            </div>

                            {/* Status and Gamification Badge */}
                            <div className="pt-1">
                              {item.status === 'تم التسليم' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>تم التسليم ✓ + ساعتان تطوعية مضافة</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>محفوظ بالأمانات (قيد الحفظ — تُضاف الساعات فور التسليم)</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions for this item */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {item.status === 'محفوظ بالأمانات' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsMyItemsOpen(false);
                                  handleOpenEdit(item);
                                }}
                                className="bevel-btn py-1 px-2.5 rounded text-xs font-bold text-[#3e271b] flex items-center gap-1 cursor-pointer"
                                title="تعديل بيانات المعثور"
                              >
                                <Edit3 className="w-3 h-3 text-[#5a3e2b]" />
                                <span>تعديل</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsMyItemsOpen(false);
                                  setItemToDelete(item);
                                }}
                                className="bevel-btn py-1 px-2 rounded text-xs font-bold text-red-700 hover:text-red-900 border-red-300 flex items-center gap-1 cursor-pointer"
                                title="حذف هذا البلاغ"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                                <span>حذف</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-emerald-800 font-bold bg-white/80 px-2 py-1 rounded border border-emerald-200">
                              مكتمل ومعتمد ✓
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="vintage-panel p-3 border-t border-[#cfc2b2] flex items-center justify-between">
              <span className="text-[11px] text-[#7d6859]">
                جامعة شقراء — عمادة شؤون الطلاب والأمانات
              </span>
              <button
                type="button"
                onClick={() => setIsMyItemsOpen(false)}
                className="bevel-btn py-1.5 px-4 rounded text-xs text-[#5a3e2b] font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: EDIT ITEM DATA (Student / Staff Edit Dialog)
          ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="vintage-card w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="vintage-panel p-3 sm:p-4 border-b border-[#cfc2b2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#5a3e2b]" />
                <h2 className="text-base sm:text-lg font-bold text-[#3e271b]">
                  تعديل بيانات المعثور [{editingItem.refNumber}]
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="bevel-btn p-1 rounded text-[#5a3e2b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="p-4 sm:p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#3e271b] mb-1">
                  اسم المعثور / الغرض *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3e271b] mb-1">
                    تصنيف المعثور *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                  >
                    <option value="electronics">إلكترونيات</option>
                    <option value="documents">وثائق وبطاقات</option>
                    <option value="belongings">مقتنيات شخصية</option>
                    <option value="keys">مفاتيح</option>
                    <option value="tools">أدوات ومستلزمات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3e271b] mb-1">
                    الكلية / المرفق *
                  </label>
                  <select
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                  >
                    {COLLEGES_LIST.filter(c => c !== 'كل الكليات والمرافق').map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3e271b] mb-1">
                  الموقع الدقيق للعثور عليه *
                </label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3e271b] mb-1">
                  وصف دقيق وعلامات فارقة
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#FAF7F0] border-2 border-[#cfc2b2] rounded px-3 py-1.5 text-xs text-[#3e271b] focus:outline-none focus:border-[#5a3e2b]"
                />
              </div>

              {/* Form Action */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#dfd5c6]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bevel-btn py-1.5 px-3 rounded text-xs text-[#5a3e2b] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className={`bevel-btn-brown py-1.5 px-4 rounded text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    isSavingEdit ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingEdit ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Retro Assistant Quick Launcher (Only in Dashboard for authenticated students) */}
      {isAuthenticated && userRole === 'student' && (
        <button
          type="button"
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 vintage-card p-2 sm:px-3 sm:py-2 rounded-2xl shadow-xl border-2 border-[#5a3e2b] bg-[#FAF7F0] flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer group"
          title="فتح مساعد المفقودات الذكي"
        >
          <div className="w-8 h-8 rounded-xl bg-[#5a3e2b] flex items-center justify-center text-[#FAF7F0] shadow-xs group-hover:bg-[#8c4b27] transition-colors">
            <Bot className="w-5 h-5 text-amber-200" />
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-[#3e271b] flex items-center gap-1">
              <span>مساعد المفقودات</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-[10px] text-[#7d6859]">فقدت غرض؟ ابحث وسجله فوراً</div>
          </div>
        </button>
      )}

      {/* Lost Assistant Modal (Agent 1 + Agent 2 - Only for authenticated students) */}
      {isAuthenticated && userRole === 'student' && (
        <LostAssistantModal
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          onSelectItemDetails={handleAssistantSelectItemDetails}
          onItemCreated={handleAssistantItemCreated}
          allItems={items}
          roundRobinIndexRef={newItemCounterRef}
        />
      )}
    </div>
  );
}
