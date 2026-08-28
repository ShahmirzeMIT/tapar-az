import { useEffect, useState } from 'react';
import { Rate, Modal, message } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { useRating } from '@/hooks/useRating';

export default function RatingStars({
  listingId, ratingAvg, ratingCount,
}: { listingId: string; ratingAvg: number; ratingCount: number }) {
  const { user } = useAuth();
  const { myRating, submitRating, submitting } = useRating(listingId);
  const [open, setOpen] = useState(false);
  const [thankYou, setThankYou] = useState(false);
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [displayAvg, setDisplayAvg] = useState(ratingAvg);
  const [displayCount, setDisplayCount] = useState(ratingCount);

  useEffect(() => {
    setDisplayAvg(ratingAvg);
    setDisplayCount(ratingCount);
  }, [ratingAvg, ratingCount]);

  const handleOpen = () => {
    if (!user) {
      message.info('Qiymətləndirmək üçün daxil olun.');
      return;
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (pendingValue == null) return;
    try {
      await submitRating(pendingValue);
      const nextCount = myRating ? displayCount : displayCount + 1;
      const nextTotal = myRating
        ? displayAvg * displayCount - myRating + pendingValue
        : displayAvg * displayCount + pendingValue;
      setDisplayCount(nextCount);
      setDisplayAvg(Math.round((nextTotal / nextCount) * 10) / 10);
      setOpen(false);
      setThankYou(true);
    } catch {
      message.error('Xəta baş verdi, yenidən cəhd edin.');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Rate disabled allowHalf value={displayCount > 0 ? displayAvg : 0} className="text-base" />
        <span className="text-lg font-semibold text-ink dark:text-white">
          {displayCount > 0 ? displayAvg.toFixed(1) : '—'}
        </span>
        <span className="text-sm text-muted">({displayCount} rəy)</span>
      </div>
      <button
        onClick={handleOpen}
        className="text-sm font-medium underline underline-offset-2 text-ink dark:text-white hover:opacity-70"
      >
        {myRating ? 'Qiyməti dəyiş' : 'Qiymət ver'}
      </button>

      <Modal
        title="Bu elanı necə qiymətləndirirsiniz?"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Göndər"
        cancelText="Ləğv et"
        confirmLoading={submitting}
        okButtonProps={{ disabled: pendingValue == null }}
      >
        <div className="py-4 flex justify-center">
          <Rate
            allowHalf={false}
            defaultValue={myRating ?? 0}
            onChange={(v) => setPendingValue(v)}
          />
        </div>
      </Modal>

      <Modal
        open={thankYou}
        onCancel={() => setThankYou(false)}
        footer={null}
        centered
      >
        <div className="py-6 text-center">
          <p className="text-lg font-semibold text-ink dark:text-white">Təşəkkür edirik!</p>
          <p className="text-sm text-muted mt-1">Rəyiniz uğurla qeydə alındı.</p>
        </div>
      </Modal>
    </div>
  );
}
