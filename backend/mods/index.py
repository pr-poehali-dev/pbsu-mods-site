import json
import os
import urllib.parse
import pg8000.native

SCHEMA = "t_p24636534_pbsu_mods_site"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    dsn = os.environ["DATABASE_URL"]
    r = urllib.parse.urlparse(dsn)
    password = urllib.parse.unquote(r.password) if r.password else None
    return pg8000.native.Connection(
        user=r.username,
        password=password,
        host=r.hostname,
        port=r.port or 5432,
        database=r.path.lstrip("/"),
        ssl_context=False,
    )


def handler(event: dict, context) -> dict:
    """Получение списка модов и публикация нового мода."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "GET":
        conn = get_conn()
        rows = conn.run(
            f"""
            SELECT id, title, description, category, author, downloads,
                   image, file_url, file_size,
                   TO_CHAR(created_at, 'YYYY-MM-DD') as date
            FROM {SCHEMA}.mods
            ORDER BY created_at DESC
            """
        )
        cols = ["id", "title", "description", "category", "author", "downloads",
                "image", "fileUrl", "fileSize", "date"]
        mods = [dict(zip(cols, row)) for row in rows]
        conn.close()
        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"mods": mods}),
        }

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        title = body.get("title", "").strip()
        description = body.get("description", "").strip()
        category = body.get("category", "mod")
        author = body.get("author", "").strip()
        image = body.get("image", "")
        file_url = body.get("fileUrl", "")
        file_size = body.get("fileSize", "")

        if not title or not description or not author or category not in ("mod", "3ds", "skin"):
            return {
                "statusCode": 400,
                "headers": {**CORS, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Заполните все обязательные поля"}),
            }

        conn = get_conn()
        rows = conn.run(
            f"""
            INSERT INTO {SCHEMA}.mods (title, description, category, author, image, file_url, file_size)
            VALUES (:title, :description, :category, :author, :image, :file_url, :file_size)
            RETURNING id, TO_CHAR(created_at, 'YYYY-MM-DD') as date
            """,
            title=title, description=description, category=category,
            author=author, image=image, file_url=file_url, file_size=file_size,
        )
        row = rows[0]
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({
                "mod": {
                    "id": row[0],
                    "title": title,
                    "description": description,
                    "category": category,
                    "author": author,
                    "downloads": 0,
                    "image": image,
                    "fileUrl": file_url,
                    "fileSize": file_size,
                    "date": row[1],
                }
            }),
        }

    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Method not allowed"})}