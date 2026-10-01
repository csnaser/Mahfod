import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Phone,
  Building2,
  Tag
} from 'lucide-react';
import { LostItem } from '../App';
import {
  ChatMessage,
  ExtractedLostReport,
  AgentPersona,
  processMahfoozTurn,
  processSawnTurn,
  executeAgent2CreateReport,
  isGeminiConfigured,
  detectCategory,
  matchShaqraCollege
} from '../lib/geminiAssistant';
import { getOfficerForCollege, getOfficerExtNumber, DEFAULT_COLLEGE } from '../collegeOfficers';
import { getItemSvg } from '../App';

interface LostAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItemDetails: (item: LostItem) => void;
  onItemCreated: (newItem: LostItem) => void;
  allItems: LostItem[];
  roundRobinIndexRef: React.MutableRefObject<number>;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-init-1',
  sender: 'assistant',
  agent: 'mahfooz',
  text: 'أهلًا! أنا مساعد المفقودات. وصف لي الغرض اللي فقدته، وبحاول أبحث لك عنه في البلاغات الموجودة.',
  timestamp: 'الآن'
};

export const LostAssistantModal: React.FC<LostAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectItemDetails,
  onItemCreated,
  allItems,
  roundRobinIndexRef
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeAgent, setActiveAgent] = useState<AgentPersona>('mahfooz');
  
  // Sawn flow state
  const [sawnStep, setSawnStep] = useState<'none' | 'ask_location' | 'ask_marks' | 'ask_phone' | 'ready_confirmation'>('none');
  const [sawnDraft, setSawnDraft] = useState<Partial<ExtractedLostReport>>({});
  const [pendingReport, setPendingReport] = useState<ExtractedLostReport | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  // Handoff from Mahfooz to Sawn
  const initiateHandoffToSawn = (initialItemName?: string, initialCollege?: string) => {
    const itemName = initialItemName || sawnDraft.name || 'غرض مفقود';
    const college = initialCollege || sawnDraft.college || DEFAULT_COLLEGE;
    const cat = detectCategory(itemName);

    const draftBase: Partial<ExtractedLostReport> = {
      name: itemName,
      college: college,
      category: cat.category,
      categoryLabel: cat.label
    };
    setSawnDraft(draftBase);
    setActiveAgent('sawn');
    setSawnStep('ask_location');

    // 1. Mahfooz says the exact handoff phrase
    const handoffMsg: ChatMessage = {
      id: `handoff-${Date.now()}`,
      sender: 'assistant',
      agent: 'mahfooz',
      text: 'ولا تشيل هم، الحين بخليك تكمّل مع خويي «صَوْن» وتطمن مفقودك في الحفظ والصون.',
      timestamp: 'الآن'
    };

    // 2. Sawn introduces himself and asks Question 1 (Exact Location)
    const sawnIntroMsg: ChatMessage = {
      id: `sawn-intro-${Date.now() + 1}`,
      sender: 'assistant',
      agent: 'sawn',
      text: `أهلًا بك! أنا «صَوْن» وبتولّى استيفاء تفاصيل مفقودك وتوجيه البلاغ للمشرف الميداني بالكلية.\n\nعلمني أولاً: وين تتوقع فقدته بالضبط؟ (في أي دور، قاعة، معمل، أو مدرج بالكلية؟)`,
      timestamp: 'الآن'
    };

    setMessages(prev => [...prev, handoffMsg, sawnIntroMsg]);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    setInputText('');
    const userMsgId = `user-${Date.now()}`;
    const updatedMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: textToSend,
        timestamp: 'الآن'
      }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // If we are currently talking to SAWN (Agent 2)
      if (activeAgent === 'sawn') {
        const sawnResult = await processSawnTurn(
          textToSend,
          sawnStep === 'none' ? 'ask_location' : sawnStep,
          sawnDraft
        );

        setSawnDraft(sawnResult.updatedDraft);
        setSawnStep(sawnResult.nextStep);

        const sawnReplyMsg: ChatMessage = {
          id: `sawn-bot-${Date.now()}`,
          sender: 'assistant',
          agent: 'sawn',
          text: sawnResult.replyText,
          timestamp: 'الآن',
          proposedReport: sawnResult.showDraftCard ? sawnResult.updatedDraft : undefined,
          requiresConfirmation: sawnResult.showDraftCard
        };

        if (sawnResult.showDraftCard) {
          setPendingReport(sawnResult.updatedDraft);
        }

        setMessages(prev => [...prev, sawnReplyMsg]);
      } else {
        // We are talking to MAHFOOZ (Agent 1)
        // Check if user specifically requested Sawn or new report
        const lower = textToSend.toLowerCase();
        if (
          lower.includes('غير موجود') ||
          lower.includes('بلاغ جديد') ||
          lower.includes('صَوْن') ||
          lower.includes('صون')
        ) {
          initiateHandoffToSawn(sawnDraft.name || textToSend, sawnDraft.college);
          setIsLoading(false);
          return;
        }

        const history = updatedMessages
          .filter(m => m.sender !== 'system')
          .map(m => ({
            role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
            content: m.text
          }));

        const result = await processMahfoozTurn(textToSend, history, allItems);

        if (result.draftItemName) {
          setSawnDraft(prev => ({ ...prev, name: result.draftItemName }));
        }
        if (result.draftCollege) {
          setSawnDraft(prev => ({ ...prev, college: result.draftCollege }));
        }

        if (result.triggerSawnHandoff) {
          initiateHandoffToSawn(result.draftItemName, result.draftCollege);
        } else {
          const mahfoozReplyMsg: ChatMessage = {
            id: `mahfooz-bot-${Date.now()}`,
            sender: 'assistant',
            agent: 'mahfooz',
            text: result.replyText,
            timestamp: 'الآن',
            matchedItems: result.matchedItems
          };
          setMessages(prev => [...prev, mahfoozReplyMsg]);
        }
      }
    } catch (err) {
      console.error('Conversation error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          agent: activeAgent,
          text: 'عذراً، حدث خطأ بسيط أثناء معالجة الطلب. يمكنك إعادة إرسال رسالتك وسأباشر المتابعة معك.',
          timestamp: 'الآن'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sawn execution: Confirm report creation and official handoff to college officer
  const handleConfirmCreateReport = async (reportToCreate?: ExtractedLostReport) => {
    const report = reportToCreate || pendingReport;
    if (!report || isSubmittingReport) return;

    setIsSubmittingReport(true);
    try {
      const res = await executeAgent2CreateReport(report, roundRobinIndexRef.current);
      roundRobinIndexRef.current += 1;

      if (res.success && res.createdItem) {
        onItemCreated(res.createdItem);
        setPendingReport(null);

        const officer = getOfficerForCollege(report.college);
        const ext = getOfficerExtNumber(report.college);

        // Official confirmation message from Sawn
        setMessages(prev => [
          ...prev,
          {
            id: `sawn-success-${Date.now()}`,
            sender: 'assistant',
            agent: 'sawn',
            text: `تم توجيه البلاغ رسمياً إلى ${officer.custodianName} — تحويلة ${ext} للتحقق الميداني وحفظه لك.\n\nرقم البلاغ المرجعي: [${res.createdItem.refNumber}]\nحالة المهمة: بانتظار التوجه الميداني من قِبل المشرف.\nتم إدراج البلاغ مباشرة في وارد بلاغات لوحة تحكم موظف الأمانات.`,
            timestamp: 'الآن',
            createdItem: res.createdItem
          }
        ]);
      }
    } catch (e) {
      console.error('Failed to create report via Sawn:', e);
      setMessages(prev => [
        ...prev,
        {
          id: `sawn-err-${Date.now()}`,
          sender: 'assistant',
          agent: 'sawn',
          text: 'تعذر رفع البلاغ حالياً، يرجى المحاولة مرة أخرى أو مراجعة مكتب الأمانات مباشرة.',
          timestamp: 'الآن'
        }
      ]);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_GREETING]);
    setActiveAgent('mahfooz');
    setSawnStep('none');
    setSawnDraft({});
    setPendingReport(null);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs">
      <div className="vintage-card w-full max-w-2xl h-[86vh] max-h-[730px] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="vintage-panel p-3.5 sm:p-4 border-b border-[#cfc2b2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
                activeAgent === 'sawn' ? 'bg-[#8c4b27] text-white' : 'bg-[#5a3e2b] text-[#FAF7F0]'
              }`}
            >
              {activeAgent === 'sawn' ? <ShieldCheck className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#3e271b] font-amiri">
                  مساعد المفقودات الذكي «محفوظ وصَوْن»
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FAF7F0] border border-[#d5c8b7] text-[#5a3e2b] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#5a3e2b]" />
                  {isGeminiConfigured ? 'محرك Gemini مفعّل' : 'الوضع الذكي المباشر'}
                </span>
              </div>
              <p className="text-[11px] text-[#7d6859] font-medium">
                {activeAgent === 'mahfooz' ? (
                  <span className="text-[#5a3e2b]">
                    الوكيل <strong>«مَحْفُوظ»</strong> (وكيل البحث والتحقق): فحص ومطابقة المعثورات المسجلة حالياً
                  </span>
                ) : (
                  <span className="text-[#8c4b27]">
                    الوكيل <strong>«صَوْن»</strong> (وكيل الاستقبال والتوجيه الميداني): استيفاء التفاصيل ورفع البلاغ لمشرف الكلية
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetChat}
              title="بدء محادثة جديدة"
              className="bevel-btn p-1.5 rounded text-[#5a3e2b] hover:text-[#3e271b] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="إغلاق"
              className="bevel-btn p-1.5 rounded text-[#5a3e2b] hover:text-[#3e271b] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips (Only in Mahfooz mode) */}
        {activeAgent === 'mahfooz' && (
          <div className="px-4 py-2 bg-[#f4ece0] border-b border-[#e5dcd0] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar shrink-0">
            <span className="text-[#8c7768] font-bold whitespace-nowrap">اقتراحات سريعة:</span>
            <button
              type="button"
              onClick={() => handleSendMessage('فقدت سماعات إيربودز بيضاء')}
              className="bevel-btn py-0.5 px-2.5 rounded-full text-[#5a3e2b] whitespace-nowrap cursor-pointer hover:bg-[#ede3d4]"
            >
              🎧 فقدت سماعات إيربودز
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('أضعت محفظتي في كلية الهندسة')}
              className="bevel-btn py-0.5 px-2.5 rounded-full text-[#5a3e2b] whitespace-nowrap cursor-pointer hover:bg-[#ede3d4]"
            >
              👝 أضعت محفظة بـ الهندسة
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('نسيت بطاقتي الجامعية في المكتبة')}
              className="bevel-btn py-0.5 px-2.5 rounded-full text-[#5a3e2b] whitespace-nowrap cursor-pointer hover:bg-[#ede3d4]"
            >
              🪪 نسيت بطاقة في المكتبة
            </button>
          </div>
        )}

        {/* Sawn Status Banner when active */}
        {activeAgent === 'sawn' && (
          <div className="px-4 py-2 bg-[#faeee5] border-b border-[#e8d5c6] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 text-[#8c4b27] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#8c4b27]" />
              <span>أنت الآن في محادثة مباشرة مع «صَوْن» لاستيفاء بلاغك الميداني</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f5dfd1] text-[#8c4b27]">
              {sawnStep === 'ask_location'
                ? 'المرحلة 1: الموقع الدقيق'
                : sawnStep === 'ask_marks'
                ? 'المرحلة 2: العلامات الفارقة واللون'
                : sawnStep === 'ask_phone'
                ? 'المرحلة 3: رقم التواصل'
                : 'المرحلة 4: الاعتماد النهائي'}
            </span>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 bg-[#FAF7F0]/60">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            const isSawn = msg.agent === 'sawn';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                    isBot
                      ? isSawn
                        ? 'bg-[#8c4b27] text-white'
                        : 'bg-[#5a3e2b] text-[#FAF7F0]'
                      : 'bg-[#4a3222] text-[#FAF7F0]'
                  }`}
                  title={isBot ? (isSawn ? 'الوكيل صَوْن' : 'الوكيل محفوظ') : 'الطالب'}
                >
                  {isBot ? (
                    isSawn ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isBot
                        ? isSawn
                          ? 'bg-[#FFFFFF] border-2 border-[#d9ba9b] text-[#3e271b] rounded-tr-xs'
                          : 'bg-[#FFFFFF] border border-[#cfc2b2] text-[#3e271b] rounded-tr-xs'
                        : 'bg-[#5a3e2b] text-[#FAF7F0] rounded-tl-xs'
                    }`}
                  >
                    {isBot && (
                      <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#f0e8dc] text-[10px] font-bold">
                        <span className={isSawn ? 'text-[#8c4b27]' : 'text-[#5a3e2b]'}>
                          {isSawn
                            ? '🛡️ [صَوْن] — وكيل الاستقبال والتوجيه الميداني'
                            : '🔍 [محفوظ] — وكيل البحث والتحقق'}
                        </span>
                        <span className="text-[#8c7768] font-mono">{msg.timestamp}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Matched Items Cards from Agent 1 (Mahfooz) */}
                  {msg.matchedItems && msg.matchedItems.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold text-[#5a3e2b] flex items-center gap-1">
                        <Search className="w-3.5 h-3.5" />
                        <span>المعثورات المحتملة المسجلة حالياً في الأمانات ({msg.matchedItems.length}):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.matchedItems.map((item) => (
                          <div
                            key={item.id}
                            className="vintage-card p-2.5 rounded-xl border border-[#cfc2b2] bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#5a3e2b] transition-all"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-12 h-12 rounded-lg bg-[#EFE7D8] border border-[#d5c8b7] shrink-0 flex items-center justify-center p-1">
                                <div
                                  className="w-full h-full flex items-center justify-center"
                                  dangerouslySetInnerHTML={{ __html: getItemSvg(item) }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-mono text-[#7d6859]">{item.refNumber}</div>
                                <div className="text-xs font-bold text-[#3e271b] truncate" title={item.name}>
                                  {item.name}
                                </div>
                                <div className="text-[10px] text-[#8c7768] truncate">
                                  📍 {item.college}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#f0e8dc]">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  item.status === 'محفوظ بالأمانات' ? 'badge-mahfooz' : 'badge-delivered'
                                }`}
                              >
                                {item.status}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onSelectItemDetails(item);
                                }}
                                className="bevel-btn-brown py-1 px-2 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <span>[ تفاصيل واستلام ]</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Not among these button -> Hand off to Sawn */}
                      <button
                        type="button"
                        onClick={() => initiateHandoffToSawn(sawnDraft.name, sawnDraft.college)}
                        className="w-full text-center py-2 px-3 bg-[#fdf5ed] border-2 border-dashed border-[#d9ba9b] rounded-xl text-xs font-bold text-[#8c4b27] hover:bg-[#faeee5] cursor-pointer mt-1 flex items-center justify-center gap-2 transition-all shadow-xs"
                      >
                        <span>❌ المفقود غير موجود بين هذه النتائج، أود رفع بلاغ جديد</span>
                      </button>
                    </div>
                  )}

                  {/* Proposed Report Card (Agent 2 - Sawn Handover & Confirmation) */}
                  {msg.proposedReport && (
                    <div className="vintage-card p-3.5 rounded-xl border-2 border-[#8c4b27] bg-[#FFFDF9] shadow-md space-y-3">
                      <div className="flex items-center justify-between border-b border-[#dfd5c6] pb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#8c4b27]">
                          <FileText className="w-4 h-4 text-[#8c4b27]" />
                          <span>بطاقة مسودة البلاغ للاعتماد النهائي (الوكيل «صَوْن»):</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#f5e6dc] text-[#8c4b27] rounded-full border border-[#e8d0bf]">
                          جاهزة للاعتماد
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#e5dcd0]">
                          <span className="text-[#8c7768] block text-[10px] font-bold">اسم الغرض:</span>
                          <span className="font-bold text-[#3e271b]">{msg.proposedReport.name}</span>
                        </div>
                        <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#e5dcd0]">
                          <span className="text-[#8c7768] block text-[10px] font-bold">التصنيف:</span>
                          <span className="font-bold text-[#3e271b]">{msg.proposedReport.categoryLabel}</span>
                        </div>
                        <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#e5dcd0]">
                          <span className="text-[#8c7768] block text-[10px] font-bold flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-[#5a3e2b]" />
                            الكلية المعنية:
                          </span>
                          <span className="font-bold text-[#3e271b]">{msg.proposedReport.college}</span>
                        </div>
                        <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#e5dcd0]">
                          <span className="text-[#8c7768] block text-[10px] font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#8c4b27]" />
                            الموقع الدقيق بالكلية:
                          </span>
                          <span className="font-bold text-[#8c4b27]">{msg.proposedReport.exactLocation || msg.proposedReport.location}</span>
                        </div>
                      </div>

                      <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#e5dcd0] text-xs">
                        <span className="text-[#8c7768] block text-[10px] font-bold">العلامات الفارقة والوصف:</span>
                        <span className="text-[#5a3e2b] leading-relaxed">{msg.proposedReport.marks || msg.proposedReport.description}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#e5dcd0]">
                          <span className="text-[#8c7768] block text-[10px] font-bold flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#5a3e2b]" />
                            رقم الجوال للتواصل:
                          </span>
                          <span className="font-bold text-[#3e271b] font-mono">{msg.proposedReport.phone || '05XXXXXXXX'}</span>
                        </div>
                        <div className="bg-[#fcf5ef] p-2 rounded-lg border border-[#e8d5c6]">
                          <span className="text-[#8c4b27] block text-[10px] font-bold">المشرف الميداني المسؤول:</span>
                          <span className="font-bold text-[#8c4b27]">
                            {getOfficerForCollege(msg.proposedReport.college).custodianName} — تحويلة {getOfficerExtNumber(msg.proposedReport.college)}
                          </span>
                        </div>
                      </div>

                      {/* Explicit User Confirmation Action */}
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#dfd5c6]">
                        <button
                          type="button"
                          onClick={() => {
                            setPendingReport(null);
                            setSawnStep('ask_location');
                            handleSendMessage('أود تعديل الموقع أو تفاصيل الغرض');
                          }}
                          className="bevel-btn py-1.5 px-3 rounded-lg text-xs text-[#5a3e2b] cursor-pointer"
                        >
                          تعديل التفاصيل
                        </button>
                        <button
                          type="button"
                          disabled={isSubmittingReport}
                          onClick={() => handleConfirmCreateReport(msg.proposedReport)}
                          className={`bevel-btn-brown py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow hover:brightness-105 transition-all ${
                            isSubmittingReport ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>{isSubmittingReport ? 'جاري توجيه البلاغ للمشرف...' : 'نعم، أؤكد رفع البلاغ وإحالته'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Created Item Card (After Sawn Execution) */}
                  {msg.createdItem && (
                    <div className="p-3 bg-[#e8f3ea] border-2 border-[#a3c9a8] rounded-xl text-xs space-y-2 shadow-xs">
                      <div className="font-bold text-[#1e5927] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#1e5927]" />
                        <span>تم توجيه وتوثيق البلاغ الميداني بنجاح!</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#2b6635] pt-1 border-t border-[#c6e3ca]">
                        <span>الرقم المرجعي: <strong className="font-mono">{msg.createdItem.refNumber}</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectItemDetails(msg.createdItem!);
                          }}
                          className="bevel-btn py-1 px-2.5 rounded font-bold text-[#1e5927] cursor-pointer"
                        >
                          عرض بطاقة المعثور
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#7d6859] pr-11">
              <div className="w-2 h-2 rounded-full bg-[#5a3e2b] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#5a3e2b] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#5a3e2b] animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="font-bold text-[11px]">
                {activeAgent === 'mahfooz'
                  ? '«مَحْفُوظ» يبحث ويطابق في سجلات الأمانات...'
                  : '«صَوْن» يدقق التفاصيل ويجهز الإحالة للمشرف...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-[#f8f2e7] border-t border-[#cfc2b2] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeAgent === 'mahfooz'
                  ? 'اكتب ردك لـ «مَحْفُوظ»... (مثال: فقدت سماعة بالبهو، أو محفظة سوداء)'
                  : sawnStep === 'ask_location'
                  ? 'اكتب لـ «صَوْن» الموقع الدقيق (مثال: في معمل الحاسب 2 بالدور الأرضي)...'
                  : 'اكتب العلامات المميزة ورقم الجوال للتواصل...'
              }
              disabled={isLoading}
              className="flex-1 bg-white border-2 border-[#cfc2b2] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#3e271b] placeholder:text-[#9e8b7d] focus:outline-none focus:border-[#5a3e2b]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className={`bevel-btn-brown py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow ${
                isLoading || !inputText.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>إرسال</span>
              <Send className="w-3.5 h-3.5 rotate-180" />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#8c7768]">
            <span>
              {activeAgent === 'mahfooz'
                ? '🔍 تتحدث مع «مَحْفُوظ»: للبحث والمطابقة في المعثورات الحالية'
                : '🛡️ تتحدث مع «صَوْن»: لاستيفاء البلاغ وتوجيهه لمشرف الكلية'}
            </span>
            <span className="font-mono">مَحْفُوظ وصَوْن — أمانات شقراء</span>
          </div>
        </div>

      </div>
    </div>
  );
};
