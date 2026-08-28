import { useState } from 'react';
import { Rate, Modal, message } from 'antd';
import { StarFilled } from '@ant-design/icons';
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
      setOpen(false);
      setThankYou(true);
    } catch {
      message.error('Xəta baş verdi, yenidən cəhd edin.');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <StarFilled className="text-yellow-500 text-lg" />
        <span className="text-lg font-semibold text-ink dark:text-white">
          {ratingCount > 0 ? ratingAvg.toFixed(1) : '—'}
        </span>
        <span className="text-sm text-muted">({ratingCount} rəy)</span>
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
