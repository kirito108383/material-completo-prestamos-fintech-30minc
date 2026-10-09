import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatEUR } from '../../utils/financialCalculations';
import { Star, MessageSquarePlus, CheckCircle, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { customerReviews, openReviewModal } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with metrics */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Opiniones Verificadas • España
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3D] tracking-tight">
              Más de 200.000 clientes confían en INSTACREDIT España
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Nuestros usuarios destacan la inmediatez de la Cuenta Digital IBAN, el abono por Bizum en 15 minutos y la transparencia de tipos regulada por el Banco de España y la Ley 16/2011.
            </p>
          </div>

          {/* Metrics Box & Review CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <div className="text-xs font-bold text-emerald-950">
                <span className="text-base font-black">4.9</span> / 5.0 (200K+ operaciones)
              </div>
            </div>

            <button
              onClick={() => openReviewModal()}
              className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Deja tu reseña verificada</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customerReviews.slice(0, 6).map((rev, index) => {
            const avatarColors = [
              'bg-blue-100 text-[#0066FF]',
              'bg-emerald-100 text-emerald-700',
              'bg-purple-100 text-purple-700',
              'bg-amber-100 text-amber-700',
              'bg-cyan-100 text-cyan-700',
              'bg-slate-100 text-slate-700'
            ];

            return (
              <div
                key={rev.id}
                className="bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Quote Icon & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-slate-300" />
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                        avatarColors[index % avatarColors.length]
                      }`}
                    >
                      {rev.author.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                        {rev.author}
                        {rev.verifiedLoan && (
                          <span title="Préstamo Verificado" className="inline-flex">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {rev.city}, España • {rev.date}
                      </span>
                    </div>
                  </div>

                  {rev.amountRequested && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Financiado</span>
                      <span className="font-bold text-xs text-[#0066FF] tabular-nums">
                        {formatEUR(rev.amountRequested)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
