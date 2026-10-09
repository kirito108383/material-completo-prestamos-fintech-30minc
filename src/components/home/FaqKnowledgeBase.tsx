import React, { useState } from 'react';
import { FAQ_ARTICLES } from '../../data/initialData';
import { ChevronDown, HelpCircle, BookOpen, ShieldCheck } from 'lucide-react';

export const FaqKnowledgeBase: React.FC = () => {
  const [openArticleId, setOpenArticleId] = useState<string | null>('faq-1');

  const toggleArticle = (id: string) => {
    setOpenArticleId(prev => (prev === id ? null : id));
  };

  return (
    <section id="dudas-frecuentes" className="py-16 sm:py-24 bg-[#F4F7FB] border-t border-slate-200 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Base de Conocimiento y Preguntas Frecuentes • España
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3D] tracking-tight">
            Todo lo que necesitas saber antes y después de solicitar en INSTACREDIT
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Respuestas detalladas con sustento legal sobre tipos de interés, Cuenta Digital IBAN, plazos, prórrogas y garantías europeas conforme a la Ley 16/2011 y supervisión del Banco de España.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ARTICLES.map((article) => {
            const isOpen = openArticleId === article.id;
            return (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleArticle(article.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                      {article.question}
                    </h3>
                    <p className="text-xs text-[#0066FF] font-semibold">
                      {article.category}
                    </p>
                  </div>
                  <div className={`p-1.5 rounded-full bg-blue-50 text-[#0066FF] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-blue-100 text-[#0066FF]' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-slate-50/40">
                    <div className="whitespace-pre-line">
                      {article.answer.trim()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Regulatory assurance card at bottom of FAQ */}
        <div className="mt-10 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 flex items-center gap-3 text-xs">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <p>
            ¿Tienes alguna consulta adicional no resuelta en esta sección? Puedes comunicarte directamente a nuestra línea gratuita nacional <strong>900 839 201</strong> o presentar una consulta formal en nuestro Servicio de Atención al Cliente (SAC) con resolución en 15 días hábiles conforme a la normativa del Banco de España.
          </p>
        </div>

      </div>
    </section>
  );
};
