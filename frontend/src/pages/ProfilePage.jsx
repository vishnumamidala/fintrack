import { useEffect, useMemo, useState } from "react";
import { Camera, Trash2, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });

const resizeImage = async (file) => {
  const source = await toDataUrl(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Unable to load image"));
    img.src = source;
  });

  const canvas = document.createElement("canvas");
  const size = 320;
  const ratio = Math.min(size / image.width, size / image.height, 1);
  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
};

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
  }, [user]);

  const initials = useMemo(
    () =>
      (name || user?.name || "U")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join(""),
    [name, user]
  );

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const nextAvatar = await resizeImage(file);
    setAvatar(nextAvatar);
    event.target.value = "";
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    await updateProfile({ name: name.trim(), avatar });
    setSaving(false);
  };

  return (
    <div className="dashboard">
      <section className="assistant-hero reveal-up">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>A personal workspace should still feel quiet.</h2>
          <p className="hero-copy">
            Keep your identity simple, clean, and recognizable across the product with a minimal profile setup.
          </p>
        </div>
      </section>

      <section className="card profile-card reveal-up">
        <div className="card-head">
          <div>
            <h3>Profile</h3>
            <p className="panel-copy">Manage your identity and photo so the product feels personal and complete.</p>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSave}>
          <div className="profile-avatar-block">
            <div className="profile-avatar">
              {avatar ? <img src={avatar} alt={name || "User avatar"} /> : <span>{initials || <UserRound size={24} />}</span>}
            </div>
            <div className="profile-avatar-actions">
              <label className="button secondary profile-upload">
                <Camera size={16} />
                Change photo
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
              {avatar ? (
                <button type="button" className="button ghost" onClick={() => setAvatar("")}>
                  <Trash2 size={16} />
                  Remove
                </button>
              ) : null}
            </div>
          </div>

          <div className="profile-fields">
            <label>
              <span>Full Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={50} />
            </label>
            <label>
              <span>Email</span>
              <input value={user?.email || ""} readOnly />
            </label>
          </div>

          <button className="button primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>
    </div>
  );
};
