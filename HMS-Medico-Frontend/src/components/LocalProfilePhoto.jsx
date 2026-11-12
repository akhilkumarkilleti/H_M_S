import { useEffect, useState } from "react";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export default function LocalProfilePhoto({ role, userKey, name, existingPhoto, size = 52 }) {
  const storageKey = `hms-dashboard-profile-photo:${role}:${userKey || "default"}`;
  const [photo, setPhoto] = useState(() => {
    try { return window.localStorage.getItem(storageKey) || ""; }
    catch { return ""; }
  });
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
    try { setPhoto(window.localStorage.getItem(storageKey) || ""); }
    catch { setPhoto(""); }
  }, [storageKey]);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Choose an image smaller than 15 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const source = String(reader.result || "");
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/webp", 0.82);
        try {
          window.localStorage.setItem(storageKey, imageData);
          setPhoto(imageData);
        } catch {
          setError("This image could not be saved in this browser. Try a smaller image.");
        }
      };
      image.onerror = () => setError("Unable to open this image.");
      image.src = source;
    };
    reader.onerror = () => setError("Unable to read this image.");
    reader.readAsDataURL(file);
  };

  const visiblePhoto = imageFailed ? "" : (photo || existingPhoto || "");
  const initial = String(name || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 4, flex: "0 0 auto" }}>
      <label title="Choose a profile photo" style={{ width: size, height: size, display: "grid", placeItems: "center", overflow: "hidden", borderRadius: "50%", background: "#e0f2fe", color: "#075985", fontWeight: 800, fontSize: Math.round(size * 0.42), cursor: "pointer", border: "2px solid rgba(255,255,255,.75)" }}>
        {visiblePhoto ? <img src={visiblePhoto} alt={`${name || "User"} profile`} onError={() => setImageFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initial}
        <input type="file" accept="image/*" onChange={handleFile} aria-label="Choose a profile photo from your device" style={{ display: "none" }} />
      </label>
      <label style={{ color: "#64748b", fontSize: 10, lineHeight: 1.2, cursor: "pointer", textAlign: "center" }}>
        {photo ? "Change photo" : "Add photo"}
        <input type="file" accept="image/*" onChange={handleFile} aria-label="Browse for a profile photo" style={{ display: "none" }} />
      </label>
      {error && <span role="alert" style={{ maxWidth: 150, color: "#b91c1c", fontSize: 10, textAlign: "center" }}>{error}</span>}
    </div>
  );
}
