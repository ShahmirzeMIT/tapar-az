import { useCallback, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import type { MediaItem } from '@/types';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_IMAGE_MB = 8;
const MAX_VIDEO_MB = 100;

function contentTypeFor(file: File): string {
  if (file.type) return file.type;
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'mov') return 'video/quicktime';
  if (extension === 'webm') return 'video/webm';
  if (extension === 'mp4') return 'video/mp4';
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  return '';
}

export interface UploadProgressState {
  [fileName: string]: number; // 0-100
}

export function useStorageUpload() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UploadProgressState>({});
  const [uploading, setUploading] = useState(false);

  const validate = (file: File): string | null => {
    const type = contentTypeFor(file);
    const isImage = IMAGE_TYPES.includes(type);
    const isVideo = VIDEO_TYPES.includes(type);
    if (!isImage && !isVideo) return 'Yalnız JPG, PNG, WEBP şəkil və ya MP4, MOV, WEBM video qəbul olunur.';
    if (isImage && file.size > MAX_IMAGE_MB * 1024 * 1024) return `Şəkil ${MAX_IMAGE_MB}MB-dan böyük ola bilməz.`;
    if (isVideo && file.size > MAX_VIDEO_MB * 1024 * 1024) return `Video ${MAX_VIDEO_MB}MB-dan böyük ola bilməz.`;
    return null;
  };

  const uploadFile = useCallback((file: File, listingId: string, order: number): Promise<MediaItem> => {
    return new Promise((resolve, reject) => {
      const err = validate(file);
      if (err) return reject(new Error(err));
      if (!user) return reject(new Error('Zəhmət olmasa daxil olun.'));

      const contentType = contentTypeFor(file);
      const isVideo = VIDEO_TYPES.includes(contentType);
      const path = `listings/${user.uid}/${listingId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      // Explicit metadata is important for browsers that report an empty or
      // generic MIME type for MOV/video files; Storage rules validate this type.
      const task = uploadBytesResumable(storageRef, file, { contentType });

      setUploading(true);
      task.on(
        'state_changed',
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setProgress((p) => ({ ...p, [file.name]: pct }));
        },
        (uploadErr) => {
          setUploading(false);
          reject(uploadErr);
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setUploading(false);
          resolve({ url, path, type: isVideo ? 'video' : 'image', order });
        },
      );
    });
  }, [user]);

  const deleteFile = useCallback(async (path: string) => {
    try {
      await deleteObject(ref(storage, path));
    } catch {
      // Ignore if already deleted
    }
  }, []);

  return { uploadFile, deleteFile, progress, uploading };
}
