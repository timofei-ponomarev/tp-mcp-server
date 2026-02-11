# Targetprocess MCP Server

MCP сервер для взаимодействия с Targetprocess — платформой для управления проектами и agile-планирования.

## Возможности

- Поиск сущностей (UserStory, Bug, Task, Feature, Epic и др.)
- Получение детальной информации о сущностях
- Создание и обновление сущностей
- Управление связями между сущностями (Blocker, Duplicate, Dependency, Link, Relation)
- Назначение и снятие людей с сущностей
- Управление трудозатратами по ролям (Role Effort)
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

Обновление существующей сущности. Поддерживает обновление связей, перенос между проектами/командами, управление effort.

```json
{
  "type": "UserStory",
  "id": 123456,
  "fields": {
    "name": "New Name",
    "description": "New description",
    "status": { "id": 789 },
    "assignedUser": { "id": 456 },
    "feature": { "id": 111 },
    "team": { "id": 222 },
    "release": { "id": 333 },
    "iteration": { "id": 444 },
    "effort": 16,
    "effortCompleted": 8,
    "effortToDo": 8
  }
}
```

Для удаления связи передайте `null`:

```json
{
  "type": "UserStory",
  "id": 123456,
  "fields": {
    "feature": null,
    "release": null
  }
}
```

Поддерживаемые связи: `userStory`, `feature`, `epic`, `bug`, `task` (nullable). Другие поля: `project`, `team`, `release`, `iteration`, `teamIteration` (nullable), `effort`, `effortCompleted`, `effortToDo`.

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

### create_relation

Создание связи между двумя сущностями.

```json
{
  "masterId": 123,
  "slaveId": 456,
  "relationType": "Blocker"
}
```

Типы связей: `Blocker` (master блокирует slave), `Duplicate` (master дублирует slave), `Relation` (общая связь), `Dependency`, `Link`.

### delete_relation

Удаление связи по ID.

```json
{
  "relationId": 789
}
```

### search_relations

Поиск всех связей для сущности.

```json
{
  "entityId": 123
}
```

### add_assignment

Назначение пользователя на сущность.

```json
{
  "entityId": 123,
  "userId": 456,
  "roleId": 789
}
```

`roleId` — опциональный (например, Developer, QA, Designer).

### remove_assignment

Удаление назначения по ID.

```json
{
  "assignmentId": 123
}
```

### get_assignments

Получение всех назначенных людей на сущность.

```json
{
  "entityId": 123
}
```

### create_role_effort

Создание записи трудозатрат по роли.

```json
{
  "entityId": 123,
  "roleId": 456,
  "effort": 16
}
```

### update_role_effort

Обновление трудозатрат по роли.

```json
{
  "roleEffortId": 789,
  "effort": 24,
  "effortCompleted": 10,
  "effortToDo": 14
}
```

### delete_role_effort

Удаление записи трудозатрат.

```json
{
  "roleEffortId": 789
}
```

### get_role_efforts

Получение всех записей трудозатрат для сущности.

```json
{
  "entityId": 123
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
