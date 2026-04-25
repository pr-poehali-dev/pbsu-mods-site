import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Category = "all" | "mod" | "3ds" | "skin";

interface Mod {
  id: number;
  title: string;
  description: string;
  category: "mod" | "3ds" | "skin";
  author: string;
  downloads: number;
  image: string;
  fileUrl: string;
  fileSize: string;
  date: string;
}

const HERO_IMAGE = "https://cdn.poehali.dev/projects/43089776-7afe-400b-8d64-8d5b7988ae18/files/4ac7d451-2ad6-41b6-8627-a147e932cdc1.jpg";

const DEMO_MODS: Mod[] = [
  {
    id: 1,
    title: "Mercedes-Benz Citaro G",
    description: "Реалистичная модель Mercedes Citaro G с HD текстурами, анимированными дверями и рабочими огнями. Полностью совместим с PBSU последней версии.",
    category: "mod",
    author: "BusModder_RU",
    downloads: 1842,
    image: HERO_IMAGE,
    fileUrl: "#",
    fileSize: "48 МБ",
    date: "2026-04-20",
  },
  {
    id: 2,
    title: "Ночной город — 3D сцена",
    description: "3DS файл ночного мегаполиса с неоновыми огнями, небоскрёбами и оживлёнными улицами. Идеально для городских маршрутов.",
    category: "3ds",
    author: "CityDesigner",
    downloads: 934,
    image: HERO_IMAGE,
    fileUrl: "#",
    fileSize: "120 МБ",
    date: "2026-04-18",
  },
  {
    id: 3,
    title: "Скин РосАвтобус 2024",
    description: "Официальная ливрея РосАвтобус с логотипом, номерами маршрутов и рекламными вставками. Поддерживает все базовые автобусы игры.",
    category: "skin",
    author: "SkinMaster99",
    downloads: 2107,
    image: HERO_IMAGE,
    fileUrl: "#",
    fileSize: "12 МБ",
    date: "2026-04-15",
  },
  {
    id: 4,
    title: "Ikarus 280 — Легенда",
    description: "Культовый советский автобус-гармошка Ikarus 280 с детальным интерьером, аутентичными звуками и правильной физикой.",
    category: "mod",
    author: "RetroMods",
    downloads: 3214,
    image: HERO_IMAGE,
    fileUrl: "#",
    fileSize: "65 МБ",
    date: "2026-04-10",
  },
  {
    id: 5,
    title: "Горная трасса Карпаты",
    description: "Живописная горная дорога с тоннелями, серпантинами и альпийскими деревнями. 3DS сцена высокого качества.",
    category: "3ds",
    author: "MountainRoads",
    downloads: 678,
    image: HERO_IMAGE,
    fileUrl: "#",
    fileSize: "89 МБ",
    date: "2026-04-08",
  },
  {
    id: 6,
    title: "Скин «Киберпанк 2077»",
    description: "Футуристический скин в стиле киберпанк с неоновыми полосами, светящимися элементами и эффектами голограмм.",
    category: "skin",
    author: "NeonSkins",
    downloads: 1456,
    image: HERO_IMAGE,
    fileUrl: "#",
    fileSize: "18 МБ",
    date: "2026-04-05",
  },
];

type Page = "home" | "mods" | "publish" | "support" | "rules" | "about";

const categoryLabels: Record<string, string> = {
  mod: "Мод",
  "3ds": "3DS",
  skin: "Скин",
};

const categoryColors: Record<string, string> = {
  mod: "category-badge-mod",
  "3ds": "category-badge-3ds",
  skin: "category-badge-skin",
};

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [mods, setMods] = useState<Mod[]>(DEMO_MODS);
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "",
    category: "mod" as "mod" | "3ds" | "skin",
    image: null as File | null,
    file: null as File | null,
    imagePreview: "",
    fileName: "",
  });

  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPublishSuccess(false);
  }, [page]);

  const filtered = activeFilter === "all" ? mods : mods.filter((m) => m.category === activeFilter);

  function handleDownload(mod: Mod) {
    const link = document.createElement("a");
    link.href = mod.fileUrl;
    link.download = mod.title;
    link.click();
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file, imagePreview: URL.createObjectURL(file) }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, file, fileName: file.name }));
  }

  function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || !form.author || !form.file) return;
    const newMod: Mod = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      category: form.category,
      author: form.author,
      downloads: 0,
      image: form.imagePreview || HERO_IMAGE,
      fileUrl: form.file ? URL.createObjectURL(form.file) : "#",
      fileSize: form.file ? `${(form.file.size / 1024 / 1024).toFixed(1)} МБ` : "—",
      date: new Date().toISOString().slice(0, 10),
    };
    setMods((prev) => [newMod, ...prev]);
    setPublishSuccess(true);
    setForm({ title: "", description: "", author: "", category: "mod", image: null, file: null, imagePreview: "", fileName: "" });
  }

  const navLinks: { label: string; page: Page; icon: string }[] = [
    { label: "Главная", page: "home", icon: "Home" },
    { label: "Моды", page: "mods", icon: "Package" },
    { label: "Опубликовать", page: "publish", icon: "Upload" },
    { label: "Поддержка", page: "support", icon: "Heart" },
    { label: "Правила", page: "rules", icon: "Shield" },
    { label: "О проекте", page: "about", icon: "Info" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white font-montserrat">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgba(10,13,20,0.9)] border-b border-[rgba(255,107,0,0.15)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <button onClick={() => setPage("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9500] flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.5)]">
              <span className="text-white font-orbitron font-black text-xs">P</span>
            </div>
            <span className="font-orbitron font-bold text-lg gradient-text hidden sm:block">PBSU MODS</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => setPage(link.page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  page === link.page
                    ? "bg-[rgba(255,107,0,0.15)] text-[#FF9500] border border-[rgba(255,107,0,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={link.icon} size={14} />
                {link.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[rgba(255,107,0,0.15)] bg-[rgba(10,13,20,0.98)]">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => { setPage(link.page); setMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 text-sm transition-colors ${
                  page === link.page ? "text-[#FF9500] bg-[rgba(255,107,0,0.08)]" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={link.icon} size={16} />
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="pt-16">
        {/* ===== HOME ===== */}
        {page === "home" && (
          <div>
            <section className="relative h-[85vh] min-h-[500px] flex items-center overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[rgba(10,13,20,0.85)] to-[rgba(10,13,20,0.4)]" />
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="max-w-2xl animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,107,0,0.4)] bg-[rgba(255,107,0,0.1)] mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                    <span className="text-xs font-orbitron text-[#FF9500] tracking-widest uppercase">Proton Bus Simulator Urban</span>
                  </div>
                  <h1 className="font-orbitron text-5xl md:text-7xl font-black leading-none mb-6">
                    <span className="gradient-text">PBSU</span>
                    <br />
                    <span className="text-white">MODS</span>
                  </h1>
                  <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                    Лучшая платформа для загрузки и публикации модов, скинов и 3D-сцен для Proton Bus Simulator Urban
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setPage("mods")}
                      className="btn-neon px-8 py-3 rounded-xl text-white font-orbitron text-sm tracking-wide flex items-center gap-2"
                    >
                      <Icon name="Package" size={18} />
                      Смотреть моды
                    </button>
                    <button
                      onClick={() => setPage("publish")}
                      className="px-8 py-3 rounded-xl border border-[rgba(0,212,255,0.4)] text-[#00D4FF] font-orbitron text-sm tracking-wide flex items-center gap-2 hover:bg-[rgba(0,212,255,0.1)] transition-all duration-300"
                    >
                      <Icon name="Upload" size={18} />
                      Опубликовать мод
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-[rgba(10,13,20,0.9)] border-t border-[rgba(255,255,255,0.06)] backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex gap-8 overflow-x-auto">
                  {[
                    { label: "Модов на сайте", value: mods.length.toString(), icon: "Package" },
                    { label: "Скачиваний", value: mods.reduce((a, b) => a + b.downloads, 0).toLocaleString("ru"), icon: "Download" },
                    { label: "Авторов", value: [...new Set(mods.map(m => m.author))].length.toString(), icon: "Users" },
                    { label: "Категорий", value: "3", icon: "Grid3X3" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 whitespace-nowrap">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(255,107,0,0.15)] flex items-center justify-center">
                        <Icon name={stat.icon} size={14} className="text-[#FF9500]" />
                      </div>
                      <div>
                        <div className="font-orbitron font-bold text-[#FF9500] text-lg leading-none">{stat.value}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-orbitron text-2xl font-bold text-white">Свежие моды</h2>
                  <p className="text-gray-500 text-sm mt-1">Последние публикации сообщества</p>
                </div>
                <button
                  onClick={() => setPage("mods")}
                  className="text-[#FF9500] hover:text-[#FF6B00] font-orbitron text-sm flex items-center gap-1 transition-colors"
                >
                  Все моды <Icon name="ArrowRight" size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mods.slice(0, 6).map((mod, i) => (
                  <ModCard key={mod.id} mod={mod} index={i} onDownload={handleDownload} />
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 pb-16">
              <div className="rounded-2xl overflow-hidden relative neon-border-orange p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,107,0,0.08)] to-[rgba(0,212,255,0.05)]" />
                <div className="relative z-10 flex-1">
                  <h3 className="font-orbitron text-xl font-bold text-white mb-2">Поддержи проект ❤️</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Твоя поддержка помогает развивать платформу и поощрять авторов модов!</p>
                </div>
                <a
                  href="https://www.donationalerts.com/r/evgenii_bulg25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 btn-neon px-8 py-3 rounded-xl font-orbitron text-sm tracking-wide flex items-center gap-2 whitespace-nowrap text-white"
                >
                  <Icon name="Heart" size={18} />
                  Поддержать
                </a>
              </div>
            </section>
          </div>
        )}

        {/* ===== MODS PAGE ===== */}
        {page === "mods" && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-8">
              <h1 className="font-orbitron text-3xl font-bold gradient-text mb-2">Каталог модов</h1>
              <p className="text-gray-500">Все публикации сообщества PBSU</p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {(["all", "mod", "3ds", "skin"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-full font-orbitron text-xs tracking-wide transition-all duration-200 ${
                    activeFilter === cat
                      ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9500] text-white shadow-[0_0_20px_rgba(255,107,0,0.4)]"
                      : "border border-[rgba(255,255,255,0.1)] text-gray-400 hover:border-[rgba(255,107,0,0.3)] hover:text-white"
                  }`}
                >
                  {cat === "all" ? "Все" : cat === "mod" ? "Моды" : cat === "3ds" ? "3DS сцены" : "Скины"}
                </button>
              ))}
              <span className="ml-auto text-gray-500 text-sm self-center">{filtered.length} модов</span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 text-gray-600">
                <Icon name="Package" size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-orbitron">Модов в этой категории пока нет</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((mod, i) => (
                  <ModCard key={mod.id} mod={mod} index={i} onDownload={handleDownload} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PUBLISH PAGE ===== */}
        {page === "publish" && (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="mb-8">
              <h1 className="font-orbitron text-3xl font-bold gradient-text mb-2">Опубликовать мод</h1>
              <p className="text-gray-500">Поделитесь своей работой с сообществом</p>
            </div>

            {publishSuccess && (
              <div className="mb-6 p-4 rounded-xl border border-[rgba(0,255,136,0.4)] bg-[rgba(0,255,136,0.08)] flex items-center gap-3 animate-fade-in">
                <Icon name="CheckCircle" size={20} className="text-[#00FF88] shrink-0" />
                <div>
                  <p className="text-[#00FF88] font-medium">Мод успешно опубликован!</p>
                  <p className="text-gray-400 text-sm">Он уже появился в каталоге модов</p>
                </div>
                <button onClick={() => setPage("mods")} className="ml-auto text-[#FF9500] hover:text-[#FF6B00] font-orbitron text-xs transition-colors">
                  Смотреть →
                </button>
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Категория</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["mod", "3ds", "skin"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, category: cat }))}
                      className={`py-3 rounded-xl border text-sm font-orbitron transition-all duration-200 ${
                        form.category === cat
                          ? cat === "mod"
                            ? "border-[#FF9500] bg-[rgba(255,107,0,0.15)] text-[#FF9500]"
                            : cat === "3ds"
                            ? "border-[#00D4FF] bg-[rgba(0,212,255,0.15)] text-[#00D4FF]"
                            : "border-[#A78BFA] bg-[rgba(139,92,246,0.15)] text-[#A78BFA]"
                          : "border-[rgba(255,255,255,0.1)] text-gray-500 hover:border-[rgba(255,255,255,0.2)] hover:text-gray-300"
                      }`}
                    >
                      {cat === "mod" ? "🎮 Мод" : cat === "3ds" ? "🏙️ 3DS" : "🎨 Скин"}
                    </button>
                  ))}
                </div>
                {form.category === "3ds" && (
                  <p className="mt-2 text-xs text-[#00D4FF] flex items-center gap-1">
                    <Icon name="Info" size={12} />
                    Для категории 3DS принимаются только файлы формата .3ds
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Название мода *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Например: Mercedes-Benz O530 Citaro"
                  required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[rgba(255,107,0,0.5)] focus:bg-[rgba(255,107,0,0.05)] transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ник автора *</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="Ваш никнейм"
                  required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[rgba(255,107,0,0.5)] focus:bg-[rgba(255,107,0,0.05)] transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Описание *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Опишите ваш мод: что в нём особенного, что включает..."
                  required
                  rows={4}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[rgba(255,107,0,0.5)] focus:bg-[rgba(255,107,0,0.05)] transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Скриншот / обложка</label>
                <label className="block w-full cursor-pointer">
                  {form.imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-[rgba(255,107,0,0.4)]">
                      <img src={form.imagePreview} alt="preview" className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-orbitron">Изменить</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-xl border border-dashed border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.02)] flex flex-col items-center justify-center gap-2 hover:border-[rgba(255,107,0,0.4)] hover:bg-[rgba(255,107,0,0.05)] transition-all duration-200">
                      <Icon name="Image" size={24} className="text-gray-600" />
                      <span className="text-gray-500 text-sm">Нажмите, чтобы загрузить фото</span>
                      <span className="text-gray-600 text-xs">JPG, PNG — до 10 МБ</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Файл мода *{" "}
                  <span className="text-gray-500 font-normal">
                    ({form.category === "3ds" ? "только .3ds" : ".zip"})
                  </span>
                </label>
                <label className="block w-full cursor-pointer">
                  <div className={`w-full h-24 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    form.fileName
                      ? "border-[rgba(0,255,136,0.4)] bg-[rgba(0,255,136,0.05)]"
                      : "border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,107,0,0.4)] hover:bg-[rgba(255,107,0,0.05)]"
                  }`}>
                    <Icon name={form.fileName ? "CheckCircle" : "FileArchive"} size={22} className={form.fileName ? "text-[#00FF88]" : "text-gray-600"} />
                    <span className={`text-sm ${form.fileName ? "text-[#00FF88]" : "text-gray-500"}`}>
                      {form.fileName || "Нажмите, чтобы загрузить файл"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept={form.category === "3ds" ? ".3ds" : ".zip"}
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.2)] flex gap-3">
                <Icon name="Shield" size={18} className="text-[#A78BFA] shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  Публикуя мод, вы принимаете{" "}
                  <button
                    type="button"
                    onClick={() => setPage("rules")}
                    className="text-[#A78BFA] hover:text-[#8B5CF6] underline transition-colors"
                  >
                    правила платформы
                  </button>
                  . Мы не несём ответственности за работоспособность модов.
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-neon py-4 rounded-xl font-orbitron text-sm tracking-wide flex items-center justify-center gap-2 text-white"
              >
                <Icon name="Upload" size={18} />
                Опубликовать мод
              </button>
            </form>
          </div>
        )}

        {/* ===== SUPPORT PAGE ===== */}
        {page === "support" && (
          <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="font-orbitron text-3xl font-bold gradient-text mb-2">Поддержка</h1>
            <p className="text-gray-500 mb-10">Помоги развитию платформы и авторам модов</p>

            <div className="grid gap-6 mb-10">
              <div className="card-glass rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FF9500] flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.4)]">
                  <Icon name="Heart" size={28} className="text-white" />
                </div>
                <h2 className="font-orbitron text-xl font-bold text-white mb-3">Поддержать автора сайта</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Ваш донат помогает нам оплачивать хостинг, развивать функции платформы и создавать лучшее место для PBSU-сообщества. Каждая копейка важна!
                </p>
                <a
                  href="https://www.donationalerts.com/r/evgenii_bulg25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon inline-flex items-center gap-2 px-8 py-3 rounded-xl font-orbitron text-sm tracking-wide text-white"
                >
                  <Icon name="ExternalLink" size={16} />
                  Задонатить на DonationAlerts
                </a>
              </div>

              <div className="card-glass rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.4)]">
                  <Icon name="Users" size={28} className="text-white" />
                </div>
                <h2 className="font-orbitron text-xl font-bold text-white mb-3">Поддержать авторов модов</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Авторы модов тратят своё время и силы, чтобы вы получали качественный контент. Загляни на страницы авторов и поддержи их напрямую.
                </p>
                <a
                  href="https://www.donationalerts.com/r/evgenii_bulg25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cyan inline-flex items-center gap-2 px-8 py-3 rounded-xl font-orbitron text-sm tracking-wide"
                >
                  <Icon name="ExternalLink" size={16} />
                  Поддержать через DonationAlerts
                </a>
              </div>
            </div>

            <div className="card-glass rounded-2xl p-6">
              <h3 className="font-orbitron text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="HelpCircle" size={20} className="text-[#FF9500]" />
                Нужна помощь?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Если у вас возникли проблемы с модом, вопросы по публикации или предложения — напишите нам. Мы стараемся отвечать в течение 24 часов.
              </p>
              <a
                href="https://vk.me/join/Lctd10kKM6Wk28YhJiqTnrWOgFwVDON4MhY="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white hover:border-[rgba(255,107,0,0.3)] hover:bg-[rgba(255,107,0,0.05)] transition-all duration-200 text-sm font-orbitron"
              >
                <Icon name="MessageCircle" size={15} />
                Написать в поддержку
              </a>
            </div>
          </div>
        )}

        {/* ===== RULES PAGE ===== */}
        {page === "rules" && (
          <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="font-orbitron text-3xl font-bold gradient-text mb-2">Правила публикации</h1>
            <p className="text-gray-500 mb-10">Прочтите перед публикацией мода</p>

            <div className="space-y-4">
              {[
                {
                  icon: "Package",
                  bg: "rgba(255,107,0,0.15)",
                  color: "#FF9500",
                  title: "Форматы файлов",
                  text: "Для категории «Мод» и «Скин» — только ZIP-архивы. Для категории «3DS» — только файлы формата .3ds. Файлы других форматов не принимаются.",
                },
                {
                  icon: "Image",
                  bg: "rgba(0,212,255,0.15)",
                  color: "#00D4FF",
                  title: "Обязательные требования",
                  text: "Каждый мод должен содержать: название, подробное описание, скриншот или обложку и сам файл. Моды без описания и скриншота могут быть удалены.",
                },
                {
                  icon: "Shield",
                  bg: "rgba(139,92,246,0.15)",
                  color: "#A78BFA",
                  title: "Оригинальность контента",
                  text: "Публикуйте только собственные работы или работы, на которые у вас есть разрешение автора. Плагиат запрещён и удаляется без предупреждения.",
                },
                {
                  icon: "AlertTriangle",
                  bg: "rgba(255,107,0,0.15)",
                  color: "#FF6B00",
                  title: "Запрещённый контент",
                  text: "Запрещено публиковать вирусы, вредоносный код, материалы 18+, политический контент, а также контент, нарушающий авторские права третьих лиц.",
                },
                {
                  icon: "CheckCircle",
                  bg: "rgba(0,255,136,0.15)",
                  color: "#00FF88",
                  title: "Качество модов",
                  text: "Старайтесь публиковать качественные, протестированные моды. Укажите версию игры, для которой создан мод, и известные ограничения или баги.",
                },
                {
                  icon: "Zap",
                  bg: "rgba(255,107,0,0.15)",
                  color: "#FF9500",
                  title: "Обновления модов",
                  text: "Если вы обновляете мод, укажите в описании что изменилось. Это помогает пользователям понять, стоит ли скачивать новую версию.",
                },
              ].map((rule) => (
                <div key={rule.title} className="card-glass rounded-xl p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: rule.bg }}>
                    <Icon name={rule.icon} size={18} style={{ color: rule.color }} />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-white text-sm mb-1">{rule.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{rule.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-xl bg-[rgba(255,107,0,0.06)] border border-[rgba(255,107,0,0.2)]">
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                Нарушение правил может привести к удалению публикации. По вопросам обратитесь в{" "}
                <button onClick={() => setPage("support")} className="text-[#FF9500] hover:text-[#FF6B00] underline transition-colors">
                  поддержку
                </button>.
              </p>
            </div>
          </div>
        )}

        {/* ===== ABOUT PAGE ===== */}
        {page === "about" && (
          <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="font-orbitron text-3xl font-bold gradient-text mb-2">О проекте</h1>
            <p className="text-gray-500 mb-10">PBSU Mods — создано для геймеров, геймерами</p>

            <div className="card-glass rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FF9500] flex items-center justify-center shadow-[0_0_25px_rgba(255,107,0,0.4)]">
                  <span className="font-orbitron font-black text-white text-xl">P</span>
                </div>
                <div>
                  <h2 className="font-orbitron text-xl font-bold text-white">PBSU Mods</h2>
                  <p className="text-gray-500 text-sm">Платформа модов для Proton Bus Simulator Urban</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong className="text-white">PBSU Mods</strong> — это независимая платформа, созданная энтузиастами для публикации и загрузки модов, скинов и 3D-сцен для игры{" "}
                <strong className="text-[#FF9500]">Proton Bus Simulator Urban</strong>.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Наша цель — объединить сообщество PBSU в одном месте, дать авторам возможность делиться своими работами, а игрокам — находить лучший контент легко и быстро.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Платформа постоянно развивается. Мы добавляем новые функции, улучшаем поиск и стараемся сделать опыт публикации максимально удобным для каждого автора.
              </p>
            </div>

            <div className="card-glass rounded-2xl p-6 mb-6 border-l-4 border-[#FF6B00]">
              <div className="flex gap-3">
                <Icon name="AlertTriangle" size={20} className="text-[#FF9500] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-orbitron font-bold text-white text-sm mb-2">Отказ от ответственности</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Мы <strong className="text-white">не несём ответственности</strong> за повреждённые, неработающие или несовместимые моды, а также за неисправные паскоды и данные, опубликованные пользователями. Все файлы загружаются на ваш страх и риск. Всегда создавайте резервные копии игровых данных перед установкой модов.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Всего модов", value: mods.length.toString(), icon: "Package", color: "#FF9500" },
                { label: "Скачиваний", value: mods.reduce((a, b) => a + b.downloads, 0).toLocaleString("ru"), icon: "Download", color: "#00D4FF" },
                { label: "Авторов", value: [...new Set(mods.map(m => m.author))].length.toString(), icon: "Users", color: "#A78BFA" },
              ].map((s) => (
                <div key={s.label} className="card-glass rounded-xl p-4 text-center">
                  <Icon name={s.icon} size={20} className="mx-auto mb-2" style={{ color: s.color }} />
                  <div className="font-orbitron font-black text-xl text-white">{s.value}</div>
                  <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="https://www.donationalerts.com/r/evgenii_bulg25"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon inline-flex items-center gap-2 px-8 py-3 rounded-xl font-orbitron text-sm tracking-wide text-white"
              >
                <Icon name="Heart" size={18} />
                Поддержать проект
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-[rgba(255,255,255,0.06)] py-8 mt-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FF6B00] to-[#FF9500] flex items-center justify-center">
                <span className="text-white font-orbitron font-black text-xs">P</span>
              </div>
              <span className="font-orbitron text-sm text-gray-500">PBSU MODS</span>
            </div>
            <p className="text-gray-600 text-xs text-center">
              Не является официальным сайтом Proton Bus Simulator. Мы не несём ответственности за контент пользователей.
            </p>
            <div className="flex gap-4">
              {(["rules", "support", "about"] as Page[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="text-gray-600 hover:text-gray-400 text-xs font-orbitron transition-colors"
                >
                  {p === "rules" ? "Правила" : p === "support" ? "Поддержка" : "О проекте"}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ModCard({ mod, index, onDownload }: { mod: Mod; index: number; onDownload: (mod: Mod) => void }) {
  return (
    <div
      className="card-glass rounded-2xl overflow-hidden flex flex-col animate-fade-in"
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={mod.image}
          alt={mod.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,13,20,0.9)] via-transparent to-transparent" />
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-orbitron font-bold ${categoryColors[mod.category]}`}>
          {categoryLabels[mod.category]}
        </span>
        <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 text-gray-300 text-xs flex items-center gap-1">
          <Icon name="Download" size={11} />
          {mod.downloads.toLocaleString("ru")}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-orbitron font-bold text-white text-sm mb-2 line-clamp-1">{mod.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">{mod.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs flex items-center gap-1">
              <Icon name="User" size={11} />
              {mod.author}
            </div>
            <div className="text-gray-600 text-xs mt-0.5">{mod.fileSize}</div>
          </div>
          <button
            onClick={() => onDownload(mod)}
            className="btn-neon px-4 py-2 rounded-lg text-xs font-orbitron flex items-center gap-1.5 text-white"
          >
            <Icon name="Download" size={13} />
            Скачать
          </button>
        </div>
      </div>
    </div>
  );
}