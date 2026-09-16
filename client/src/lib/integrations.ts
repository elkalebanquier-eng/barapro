/**
 * Integration boundaries for DevConnect.
 *
 * This static prototype deliberately does not initialize third-party SDKs until
 * credentials exist. Public VITE_* values are read only at runtime; private
 * signing keys must be moved to a backend/serverless function before launch.
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

export const imageKitConfig = {
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY ?? "",
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT ?? "",
  authenticationEndpoint: import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT ?? "",
};

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "",
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
export const isImageKitConfigured = Object.values(imageKitConfig).every(Boolean);
export const isCloudinaryConfigured = Object.values(cloudinaryConfig).every(Boolean);

export const integrationStatus = {
  firebase: isFirebaseConfigured ? "ready" : "not-configured",
  imageKit: isImageKitConfigured ? "ready" : "not-configured",
  cloudinary: isCloudinaryConfigured ? "ready" : "not-configured",
  payments: "not-connected",
} as const;
