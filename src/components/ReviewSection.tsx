'use client';

import { useState } from 'react';
import { Review } from '@/types';
import { createReview } from '@/utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';

function Stars({ rating, interactive, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <FiStar
            size={interactive ? 20 : 13}
            className={n <= rating ? 'text-amber-500 fill-amber-500' : 'text-espresso-200'}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ slug, reviews: initial }: { slug: string; reviews: Review[] }) {
  const { accessToken, user } = useSelector((s: RootState) => s.auth);
  const [reviews, setReviews] = useState(initial);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    if (!comment.trim()) { toast.error('Write something first'); return; }
    setLoading(true);
    try {
      const rev = await createReview(slug, { rating, comment }, accessToken);
      setReviews([rev, ...reviews]);
      setComment('');
      setRating(5);
      toast.success('Review posted');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not post review');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-12">
      <h2 className="font-serif text-xl font-semibold text-espresso-800 mb-6">
        Reviews {reviews.length > 0 && <span className="text-espresso-300 font-normal text-base">({reviews.length})</span>}
      </h2>

      {user && (
        <form onSubmit={submit} className="bg-espresso-50/50 rounded-2xl p-5 mb-8 border border-espresso-100/60">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-espresso-600">Your rating:</span>
            <Stars rating={rating} interactive onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think?"
            rows={3}
            className="w-full px-4 py-3 border border-espresso-100 rounded-xl bg-white text-sm text-espresso-800 placeholder:text-espresso-300 focus:ring-1 focus:ring-burnt-400 focus:border-burnt-400 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-espresso-800 text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-espresso-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post review'}
          </button>
        </form>
      )}

      {!user && (
        <p className="text-sm text-espresso-400 mb-8 bg-espresso-50/50 rounded-xl p-4 border border-espresso-100/50">
          <a href="/login" className="text-burnt-600 underline underline-offset-2">Log in</a> to leave a review.
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-espresso-400">No reviews yet. Be the first.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-espresso-50 pb-5 last:border-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-burnt-100 flex items-center justify-center text-xs font-bold text-burnt-700">
                    {r.user?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-medium text-espresso-700">{r.user}</span>
                </div>
                <Stars rating={r.rating} />
              </div>
              <p className="text-sm text-espresso-600 leading-relaxed pl-10">{r.comment}</p>
              <p className="text-[11px] text-espresso-300 mt-1.5 pl-10">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
