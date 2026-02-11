# Targetprocess MCP Use Cases

This document outlines common use cases and procedures for interacting with Targetprocess through the MCP server. Each use case demonstrates how to accomplish common tasks programmatically using the available MCP tools.

## Enterprise Use Cases

### 1. Data Model Discovery and Mapping

**Purpose:** Understand and map complex Targetprocess implementations with custom fields, entity types, and relationships.

**Business Value:**
- Gain visibility into complex, customized Targetprocess instances
- Document entity relationships for system integration
- Identify optimization opportunities in your process workflows
- Support migration or consolidation projects

**Using MCP Tools:**

```json
// Discover available entity types
{
  "action": "list_types"
}

// Explore entity properties
{
  "action": "get_properties",
  "entityType": "UserStory"
}

// Get detailed property information
{
  "action": "get_property_details",
  "entityType": "UserStory",
  "propertyName": "CustomFields"
}

// Discover API structure through error messages
{
  "action": "discover_api_structure"
}
```

**Implementation Steps:**
1. Use `inspect_object` with `list_types` to discover all entity types
2. For each entity type, use `get_properties` to list available properties
3. For custom fields, use `get_property_details` to understand their structure
4. Create a relationship map by examining entity references
5. Document the discovered data model for future reference

**Performance Considerations:**
- Cache metadata results to avoid repeated API calls
- Implement progressive discovery to avoid overwhelming the API
- Consider running discovery during off-peak hours for large instances

### 2. Enterprise Analytics and Reporting

**Purpose:** Extract and analyze data across millions of records for business intelligence and reporting.

**Business Value:**
- Create custom reports not available in the standard UI
- Perform trend analysis across projects and teams
- Generate executive dashboards with real-time data
- Identify bottlenecks and optimization opportunities

**Using MCP Tools:**

```json
// Get all projects with budget information
{
  "type": "Project",
  "include": ["Budget", "Teams", "UserStories"],
  "take": 1000
}

// Get all completed stories in a date range
{
  "type": "UserStory",
  "where": "EntityState.Name eq 'Done' and ModifyDate gt '2024-01-01' and ModifyDate lt '2024-12-31'",
  "include": ["Project", "Team", "TimeSpent", "Effort"],
  "take": 1000
}

// Get team velocity data
{
  "type": "TeamIteration",
  "include": ["Team", "UserStories", "Features"],
  "where": "EndDate lt @Today",
  "orderBy": ["EndDate desc"],
  "take": 100
}
```

**Implementation Steps:**
1. Identify the metrics and KPIs needed for analysis
2. Design queries to extract the relevant data
3. Implement data transformation and aggregation logic
4. Create visualization or export mechanisms
5. Schedule regular data extraction for trend analysis

**Performance Considerations:**
- Use specific queries to limit result sets
- Implement incremental data extraction for historical analysis
- Consider data warehousing for long-term storage and analysis
- Use pagination for large result sets

### 3. Cross-System Integration

**Purpose:** Integrate Targetprocess with other enterprise systems like JIRA, ServiceNow, or custom tools.

**Business Value:**
- Create a unified view across multiple systems
- Automate cross-system workflows
- Eliminate manual data entry and synchronization
- Enable end-to-end process visibility

**Using MCP Tools:**

```json
// Create a new user story from external system data
{
  "type": "UserStory",
  "name": "Integrate payment gateway",
  "description": "Imported from JIRA: PROJ-123",
  "project": {
    "id": 456
  },
  "team": {
    "id": 789
  }
}

// Update status based on external system events
{
  "type": "UserStory",
  "id": 12345,
  "fields": {
    "status": {
      "id": 67
    },
    "description": "Updated via integration: Build passed in Jenkins"
  }
}

// Search for items with external system references
{
  "type": "UserStory",
  "where": "Description contains 'JIRA:'",
  "include": ["Project", "Team", "AssignedUser"]
}
```

**Implementation Steps:**
1. Map entity types and fields between systems
2. Implement bidirectional synchronization logic
3. Create webhooks or scheduled jobs for updates
4. Implement conflict resolution strategies
5. Add audit logging for integration activities

**Performance Considerations:**
- Implement rate limiting to avoid API throttling
- Use batch operations for bulk updates
- Implement retry logic with exponential backoff
- Consider eventual consistency for non-critical updates

### 4. Batch Operations and Mass Updates

**Purpose:** Perform large-scale changes across many entities efficiently.

**Business Value:**
- Implement organizational changes quickly
- Apply consistent updates across projects
- Reduce manual effort for administrative tasks
- Support reorganization or restructuring initiatives

**Using MCP Tools:**

```json
// Find all unassigned high-priority items
{
  "type": "UserStory",
  "where": "AssignedUser is null and Priority.Name eq 'High'",
  "take": 1000
}

// Reassign items to a new team
{
  "type": "UserStory",
  "id": 12345,
  "fields": {
    "team": {
      "id": 789
    }
  }
}

// Update status for multiple items
// (Execute in a loop for each item ID)
{
  "type": "Bug",
  "id": 67890,
  "fields": {
    "status": {
      "id": 42
    }
  }
}
```

**Implementation Steps:**
1. Identify the entities that need to be updated
2. Create a backup or snapshot before making changes
3. Implement the updates in batches with error handling
4. Verify the changes and provide a summary report
5. Document the changes for audit purposes

**Performance Considerations:**
- Process updates in small batches (50-100 items)
- Implement concurrency control to avoid conflicts
- Add delays between batches to reduce API load
- Provide progress reporting for long-running operations

### 5. Custom Field Analysis and Management

**Purpose:** Analyze and manage custom fields across a Targetprocess instance.

**Business Value:**
- Ensure consistent use of custom fields
- Identify unused or redundant fields
- Support data governance initiatives
- Improve reporting accuracy

**Using MCP Tools:**

```json
// Get custom field definitions
{
  "action": "get_properties",
  "entityType": "CustomField"
}

// Find entities using specific custom fields
{
  "type": "UserStory",
  "where": "CustomField.RiskLevel is not null",
  "take": 500
}

// Analyze custom field usage
{
  "type": "UserStory",
  "include": ["CustomFields"],
  "take": 1000
}
```

**Implementation Steps:**
1. Extract all custom field definitions
2. Analyze usage patterns across entities
3. Identify inconsistencies or gaps
4. Create recommendations for optimization
5. Implement changes to improve data quality

**Performance Considerations:**
- Sample data for initial analysis rather than processing all records
- Focus on high-value custom fields first
- Consider the impact of custom field queries on API performance
- Implement progressive analysis for large datasets

### 6. Process Compliance and Governance

**Purpose:** Ensure process compliance and governance across projects and teams.

**Business Value:**
- Enforce organizational standards
- Support audit and compliance requirements
- Identify process violations early
- Improve overall process quality

**Using MCP Tools:**

```json
// Find items missing required information
{
  "type": "UserStory",
  "where": "Description is null or Description eq ''",
  "include": ["Project", "Team", "AssignedUser"],
  "take": 500
}

// Check for items stuck in process
{
  "type": "Bug",
  "where": "EntityState.Name eq 'In Progress' and ModifyDate lt '2024-01-01'",
  "include": ["AssignedUser", "Team"],
  "take": 500
}

// Verify proper relationships
{
  "type": "Task",
  "where": "UserStory is null",
  "include": ["Project", "Team"],
  "take": 500
}
```

**Implementation Steps:**
1. Define compliance rules and governance requirements
2. Implement queries to identify non-compliant items
3. Create automated notifications for violations
4. Generate compliance reports for stakeholders
5. Track compliance metrics over time

**Performance Considerations:**
- Schedule compliance checks during off-peak hours
- Focus on high-risk or high-value processes first
- Implement incremental checking for large datasets
- Consider sampling for initial analysis

## Common Use Cases

### 1. Viewing Department/Team Information

**Purpose:** Retrieve and analyze team and department-level information.

**Using MCP Tools:**

```json
// Search for all teams in a specific department
{
  "type": "Team",
  "include": ["Project", "AssignedUser"],
  "where": "Department.Name eq 'IT'",
  "take": 100
}
```

**Tips:**
- Use the `include` parameter to fetch related data in a single request
- The `where` clause supports complex filtering expressions
- Increase `take` value (up to 1000) to retrieve more results

### 2. Running Cost Reports

**Purpose:** Analyze project costs and spending across the organization.

**Using MCP Tools:**

```json
// Get project cost information
{
  "type": "Project",
  "include": ["Budget", "Effort", "Team"],
  "where": "StartDate gt '2024-01-01'",
  "orderBy": ["StartDate desc"]
}

// Get specific project details
{
  "type": "Project",
  "id": 123,
  "include": ["Budget", "Effort", "Team", "UserStories"]
}
```

**Tips:**
- Use date filters in the `where` clause for period-specific analysis
- Include related entities to get comprehensive cost data
- Chain multiple requests to build detailed reports

### 3. Managing Application Information

**Purpose:** Track and update application-related entities.

**Using MCP Tools:**

```json
// Create a new feature for an application
{
  "type": "Feature",
  "name": "New Authentication System",
  "description": "Implement OAuth 2.0 authentication",
  "project": {
    "id": 123
  },
  "team": {
    "id": 456
  }
}

// Search for application features
{
  "type": "Feature",
  "where": "Project.Id eq 123",
  "include": ["Project", "Team", "UserStories"]
}
```

**Tips:**
- Use entity relationships to maintain proper connections
- Include relevant teams and projects when creating new entities
- Update existing entities to reflect changes in status or ownership

### 4. Tracking Work Items

**Purpose:** Monitor and manage user stories, bugs, and tasks.

**Using MCP Tools:**

```json
// Search for active user stories
{
  "type": "UserStory",
  "where": "EntityState.Name eq 'In Progress'",
  "include": ["AssignedUser", "Team", "Project"]
}

// Update work item status
{
  "type": "UserStory",
  "id": 789,
  "fields": {
    "status": {
      "id": 101
    },
    "assignedUser": {
      "id": 202
    }
  }
}
```

**Tips:**
- Use entity states to track progress
- Include assignees and teams for accountability
- Update multiple fields in a single request

### 5. Budget vs. Actual Analysis

**Purpose:** Compare planned versus actual metrics.

**Using MCP Tools:**

```json
// Get project metrics
{
  "type": "Project",
  "include": ["Budget", "TimeSpent", "Effort"],
  "where": "EndDate gt @Today"
}

// Get team capacity
{
  "type": "Team",
  "include": ["Capacity", "TimeSpent"],
  "where": "Project.Id eq 123"
}
```

**Tips:**
- Combine multiple queries to build comprehensive reports
- Use date-based filters for period-specific analysis
- Include relevant metrics for comparison

### 6. Managing Entity Relations

**Purpose:** Create and manage dependencies, blockers, and other relations between work items.

**Business Value:**
- Visualize and track dependencies between tasks
- Identify blocking issues proactively
- Maintain traceability between related work items
- Support impact analysis for changes

**Using MCP Tools:**

```json
// Create a blocker relation (Bug 123 blocks UserStory 456)
{
  "masterId": 123,
  "slaveId": 456,
  "relationType": "Blocker"
}

// Mark a duplicate (Bug 789 is a duplicate of Bug 123)
{
  "masterId": 789,
  "slaveId": 123,
  "relationType": "Duplicate"
}

// Find all relations for an entity
{
  "entityId": 123
}

// Remove a relation
{
  "relationId": 42
}
```

**Implementation Steps:**
1. Use `search_relations` to discover existing relations for an entity
2. Use `create_relation` with appropriate type (Blocker, Duplicate, Relation, Dependency, Link)
3. Use `delete_relation` to remove outdated relations
4. Combine with `update_entity` to move entities between features/epics

**Tips:**
- Relation types: Blocker (master blocks slave), Duplicate, Relation (generic), Dependency, Link
- Use `search_relations` before creating to avoid duplicate relations
- Combine with `get_entity` to get full context on related items

### 7. Team Assignment and Role Management

**Purpose:** Manage people assignments and role-based effort tracking for work items.

**Business Value:**
- Ensure proper team allocation across projects
- Track effort by role for accurate capacity planning
- Support resource management and workload balancing
- Enable role-based reporting and analysis

**Using MCP Tools:**

```json
// Assign a user to a work item with a specific role
{
  "entityId": 12345,
  "userId": 678,
  "roleId": 1
}

// Get all people assigned to a work item
{
  "entityId": 12345
}

// Remove an assignment
{
  "assignmentId": 42
}

// Create role-based effort entry
{
  "entityId": 12345,
  "roleId": 1,
  "effort": 16
}

// Update effort tracking (time spent, remaining)
{
  "roleEffortId": 99,
  "effort": 24,
  "effortCompleted": 10,
  "effortToDo": 14
}

// Get all role efforts for a work item
{
  "entityId": 12345
}
```

**Implementation Steps:**
1. Use `get_assignments` to see current assignments on an entity
2. Use `add_assignment` to add users with optional role
3. Use `remove_assignment` to remove outdated assignments
4. Use `create_role_effort` to set up effort tracking by role
5. Use `update_role_effort` to track progress (effort, effortCompleted, effortToDo)
6. Use `get_role_efforts` to analyze effort distribution

**Tips:**
- Always check existing assignments before adding new ones
- Use `roleId` to differentiate between Developer, QA, Designer, etc.
- Combine with `update_entity` effort fields for overall effort tracking

### 8. Moving Entities Between Projects and Teams

**Purpose:** Reorganize work items across projects, teams, releases, and iterations.

**Business Value:**
- Support team restructuring and project reorganization
- Enable release planning and sprint management
- Maintain proper entity hierarchy (Epic -> Feature -> UserStory -> Task)

**Using MCP Tools:**

```json
// Move a UserStory to a different feature
{
  "type": "UserStory",
  "id": 12345,
  "fields": {
    "feature": { "id": 678 }
  }
}

// Reassign to a different team and project
{
  "type": "UserStory",
  "id": 12345,
  "fields": {
    "team": { "id": 111 },
    "project": { "id": 222 }
  }
}

// Assign to a release and iteration
{
  "type": "UserStory",
  "id": 12345,
  "fields": {
    "release": { "id": 333 },
    "iteration": { "id": 444 },
    "teamIteration": { "id": 555 }
  }
}

// Remove from current feature (unlink)
{
  "type": "UserStory",
  "id": 12345,
  "fields": {
    "feature": null
  }
}

// Set effort estimates
{
  "type": "UserStory",
  "id": 12345,
  "fields": {
    "effort": 16,
    "effortCompleted": 4,
    "effortToDo": 12
  }
}
```

**Implementation Steps:**
1. Identify entities that need to be moved
2. Use `update_entity` to set new project, team, release, or iteration
3. Use null values to remove relations (feature, epic, release, etc.)
4. Update effort fields as needed
5. Verify changes with `get_entity`

**Tips:**
- Use `null` to explicitly remove a relation (feature, epic, release, iteration, teamIteration)
- Non-nullable references (project, team) cannot be set to null
- Combine with `search_entities` to batch find and update items

## Best Practices

1. **Error Handling:**
   - Always check response status
   - Handle rate limits appropriately
   - Implement retry logic for failed requests

2. **Performance:**
   - Use specific `where` clauses to limit result sets
   - Include only necessary related data
   - Batch operations when possible

3. **Data Management:**
   - Keep entity references up to date
   - Maintain proper relationships between entities
   - Archive or clean up obsolete data

## Advanced Tips

### Complex Queries

Combine multiple conditions in where clauses:

```json
{
  "type": "UserStory",
  "where": "(EntityState.Name eq 'In Progress' or EntityState.Name eq 'Testing') and Team.Name eq 'DevOps'",
  "include": ["Tasks", "Bugs"]
}
```

### Bulk Operations

When working with multiple entities:

```json
// Get all stories for a release
{
  "type": "UserStory",
  "where": "Release.Id eq 123",
  "take": 1000
}
```

### Custom Fields

Access and update custom fields:

```json
{
  "type": "UserStory",
  "id": 456,
  "fields": {
    "CustomField.RiskLevel": "High",
    "CustomField.Priority": 1
  }
}
```

## Troubleshooting

If you encounter issues:

1. Verify entity IDs and relationships
2. Check permission levels for the authenticated user
3. Validate query syntax and field names
4. Review API response codes for specific error messages

---

*Note: The examples above assume appropriate permissions and access levels. Actual field names and entity relationships may vary based on your Targetprocess configuration.*
