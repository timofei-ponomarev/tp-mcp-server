# Targetprocess MCP Server

MCP сервер для взаимодействия с Targetprocess — платформой для управления проектами и agile-планирования.

## Возможности

- Поиск сущностей (UserStory, Bug, Task, Feature, Epic и др.)
- Получение детальной информации о сущностях
- Создание и обновление сущностей
- Добавление комментариев
- Исследование структуры API и модели данных

## Установка

```bash
npm install
npm run build
```

## Конфигурация

Сервер может быть настроен через переменные окружения или JSON файл конфигурации.

### Переменные окружения

```bash
TP_DOMAIN=your-domain.tpondemand.com
TP_ACCESS_TOKEN=your-access-token
```

### Файл конфигурации

Создайте `config/targetprocess.json`:

```json
{
  "domain": "your-domain.tpondemand.com",
  "accessToken": "your-access-token"
}
```

## Запуск через Podman

### Сборка образа

```bash
./scripts/build-local.sh
```

Скрипт выполняет установку зависимостей, линтинг, тесты, сборку TypeScript и создание контейнера.

Для подробного вывода используйте флаг `--verbose`:

```bash
./scripts/build-local.sh --verbose
```

### Запуск контейнера

Создайте файл `.env` в корне проекта:

```bash
TP_DOMAIN=your-domain.tpondemand.com
TP_ACCESS_TOKEN=your-access-token
```

Запустите контейнер:

```bash
./scripts/run-local.sh
```

Управление контейнером:

```bash
podman logs -f apptio-target-process-mcp  # логи
podman attach apptio-target-process-mcp   # подключиться
podman stop apptio-target-process-mcp     # остановить
```

## MCP Tools

### search_entities

Поиск сущностей с фильтрацией.

```json
{
  "type": "UserStory",
  "where": "EntityState.Name eq 'Open'",
  "take": 10,
  "include": ["Project", "Team"],
  "orderBy": ["CreateDate desc"]
}
```

Поддерживаемые типы: `UserStory`, `Bug`, `Task`, `Feature`, `Epic`, `PortfolioEpic`, `Solution`, `Request`, `Impediment`, `TestCase`, `TestPlan`, `Project`, `Team`, `Iteration`, `TeamIteration`, `Release`, `Program`.

### get_entity

Получение детальной информации о сущности.

```json
{
  "type": "UserStory",
  "id": 123456,
  "include": ["Project", "Team"]
}
```

### create_entity

Создание новой сущности.

```json
{
  "type": "UserStory",
  "name": "Story Name",
  "description": "Details...",
  "project": { "id": 123 },
  "team": { "id": 456 },
  "assignedUser": { "id": 789 }
}
```

### update_entity

Обновление существующей сущности.

```json
{
  "type": "UserStory",
  "id": 123456,
  "fields": {
    "name": "New Name",
    "description": "New description",
    "status": { "id": 789 },
    "assignedUser": { "id": 456 }
  }
}
```

### inspect_object

Исследование структуры API.

```json
{
  "action": "list_types"
}
```

```json
{
  "action": "get_properties",
  "entityType": "UserStory"
}
```

```json
{
  "action": "get_property_details",
  "entityType": "UserStory",
  "propertyName": "Description"
}
```

### create_comment

Добавление комментария к сущности.

```json
{
  "entityId": 123456,
  "description": "Comment text (supports markdown)"
}
```

## License

MIT
