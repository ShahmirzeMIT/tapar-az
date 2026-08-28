import { Upload, Progress, message } from 'antd';
import { PlusOutlined, DeleteOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import type { MediaItem } from '@/types';

interface MediaUploaderProps {
  listingId: string;
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

const MAX_IMAGES = 10;

export default function MediaUploader({ listingId, media, onChange }: MediaUploaderProps) {
  const { uploadFile, deleteFile, progress, uploading } = useStorageUpload();

  const imageCount = media.filter((m) => m.type === 'image').length;
  const hasVideo = media.some((m) => m.type === 'video');

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    const isVideo = file.type.startsWith('video/');
    if (isVideo && hasVideo) {
      message.warning('Yalnız bir video yükləyə bilərsiniz.');
      return Upload.LIST_IGNORE;
    }
    if (!isVideo && imageCount >= MAX_IMAGES) {
      message.warning(`Maksimum ${MAX_IMAGES} şəkil yükləyə bilərsiniz.`);
      return Upload.LIST_IGNORE;
    }
    try {
      const item = await uploadFile(file, listingId, media.length);
      onChange([...media, item]);
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Yükləmə xətası baş verdi.');
    }
    return Upload.LIST_IGNORE; // we manage our own preview grid below
  };

  const handleDelete = async (item: MediaItem) => {
    await deleteFile(item.path);
    onChange(media.filter((m) => m.path !== item.path).map((m, i) => ({ ...m, order: i })));
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const next = [...media];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((m, i) => ({ ...m, order: i })));
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {media.map((item, index) => (
          <div key={item.path} className="relative aspect-square border border-line dark:border-line-dark group overflow-hidden bg-offwhite dark:bg-black">
            {item.type === 'image' ? (
              <img src={item.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <video src={item.url} className="w-full h-full object-cover" muted />
                <VideoCameraOutlined className="absolute text-white text-2xl drop-shadow" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button type="button" onClick={() => moveItem(index, -1)} className="text-white text-xs px-1.5 py-1 bg-black/60 rounded">◀</button>
              <button type="button" onClick={() => handleDelete(item)} className="text-white text-xs px-1.5 py-1 bg-red-600/90 rounded"><DeleteOutlined /></button>
              <button type="button" onClick={() => moveItem(index, 1)} className="text-white text-xs px-1.5 py-1 bg-black/60 rounded">▶</button>
            </div>
            {index === 0 && (
              <span className="absolute top-1 left-1 bg-ink text-white text-[9px] px-1.5 py-0.5 font-semibold">ƏSAS</span>
            )}
          </div>
        ))}

        <Upload beforeUpload={beforeUpload} showUploadList={false} multiple accept="image/*,video/mp4,video/quicktime,video/webm">
          <div className="aspect-square border-2 border-dashed border-line dark:border-line-dark flex flex-col items-center justify-center cursor-pointer hover:border-ink dark:hover:border-white transition-colors text-muted">
            <PlusOutlined className="text-xl" />
            <span className="text-xs mt-1">Əlavə et</span>
          </div>
        </Upload>
      </div>

      {uploading && Object.keys(progress).length > 0 && (
        <div className="mt-3 space-y-2">
          {Object.entries(progress).map(([name, pct]) => (
            <div key={name}>
              <p className="text-xs text-muted mb-0.5 truncate">{name}</p>
              <Progress percent={pct} size="small" strokeColor="#0A0A0A" />
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 text-xs text-muted">
        Şəkillər: JPG/PNG/WEBP, maks 8MB. Video: MP4/MOV/WEBM, maks 100MB, yalnız 1 ədəd.
      </p>
    </div>
  );
}
