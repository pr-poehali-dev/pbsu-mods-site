CREATE TABLE t_p24636534_pbsu_mods_site.mods (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mod', '3ds', 'skin')),
  author TEXT NOT NULL,
  downloads INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL DEFAULT '',
  file_size TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);
