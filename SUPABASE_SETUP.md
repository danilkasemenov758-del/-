# Supabase Free

## 1. Создать проект

1. Откройте Supabase.
2. Создайте новый проект на Free plan.
3. Откройте `SQL Editor`.
4. Выполните файл `supabase.sql`.

## 2. Важно про безопасность

Не вставляйте `service_role` key во фронтенд. Он дает полный доступ к базе.

Для реальной версии лучше схема:

```txt
Telegram Mini App -> маленький API -> Supabase
```

API проверяет Telegram `initData`, права сотрудника и только потом пишет в Supabase.

## 3. Что дальше

Сейчас в проекте уже есть Express API в папке `server/`. Его можно переделать с SQLite на Supabase или оставить SQLite на VPS.

Самый быстрый безопасный путь:

1. Supabase хранит таблицы.
2. Backend хранит `SUPABASE_SERVICE_ROLE_KEY` в `.env`.
3. Mini App знает только URL backend в `config.js`.
