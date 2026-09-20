// services/avatar.ts
// Per-user avatar storage. Each account gets its own localStorage key, so
// avatars never leak between accounts and survive logout/login.

const PREFIX = "mindspace_avatar:";

type AvatarUser = { email?: string } | null | undefined;

/** Key is based on email, which both the sidebar (getUser) and profile (getProfile) have. */
export function avatarKey(user: AvatarUser): string | null {
  const email = user?.email?.trim().toLowerCase();
  return email ? `${PREFIX}${email}` : null;
}

export function getAvatar(user: AvatarUser): string | null {
  const key = avatarKey(user);
  if (!key) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Returns false if the avatar could not be saved (e.g. storage quota exceeded). */
export function saveAvatar(user: AvatarUser, dataUrl: string): boolean {
  const key = avatarKey(user);
  if (!key) return false;
  try {
    localStorage.setItem(key, dataUrl);
    return true;
  } catch {
    return false;
  }
}

/** Call after an email change so the avatar follows the account. */
export function moveAvatar(from: AvatarUser, to: AvatarUser): void {
  const fromKey = avatarKey(from);
  const toKey = avatarKey(to);
  if (!fromKey || !toKey || fromKey === toKey) return;
  try {
    const value = localStorage.getItem(fromKey);
    if (value) {
      localStorage.setItem(toKey, value);
      localStorage.removeItem(fromKey);
    }
  } catch {
    /* ignore */
  }
}

/** Center-crops to a square and shrinks to `size` px, returned as a small JPEG data URL. */
export function resizeImage(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Image processing is not supported in this browser."));
        return;
      }
      ctx.fillStyle = "#ffffff"; // avoids black background for transparent PNGs
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };

    img.src = url;
  });
}