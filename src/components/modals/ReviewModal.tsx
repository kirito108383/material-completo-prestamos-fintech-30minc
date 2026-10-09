import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, CheckCircle, MessageSquarePlus } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { isReviewModalOpen, closeReviewModal, addCustomerReview } = useApp();

  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('Madrid');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [amountRequested, setAmountRequested] = useState<number>(750);
  const [submitted, setSubmitted] = useState(false);

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    addCustomerReview({
      author,
      city,
      rating,
      comment,
      verifiedLoan: true,
      amountRequested
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeReviewModal();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full my-auto overflow-hidden border border-slate-200 relative flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-[#0066FF]" />
            <h3 className="font-extrabold text-base">Deja tu valoración en INSTACREDIT</h3>
          </div>
          <button
            onClick={closeReviewModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">¡Muchas gracias por tu reseña!</h4>
              <p className="text-xs text-slate-500">
                Tu opinión ayuda a mantener la máxima transparencia financiera en España.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  ¿Cómo calificarías tu experiencia con INSTACREDIT?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre y Apellidos *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ej. Carmen Navarro"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad o Provincia</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej. Madrid o Barcelona"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Importe del Préstamo (€ EUR)</label>
                  <input
                    type="number"
                    step={50}
                    value={amountRequested}
                    onChange={(e) => setAmountRequested(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tu Experiencia o Reseña *</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comenta sobre la rapidez del abono, la atención del asesor o el uso de tu cuenta digital..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0066FF]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Publicar Reseña Verificada
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
