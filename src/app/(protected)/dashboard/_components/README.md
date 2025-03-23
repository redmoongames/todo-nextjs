# Dashboard Components

This directory contains the components used in the dashboard page of the application.

## Component Architecture

The dashboard follows a modular architecture with the following components:

- **DashboardList**: Main container component that renders a list of dashboards.
- **DashboardCard**: Card component that displays a single dashboard with its details and statistics.
- **TaskStatistics**: Displays statistics about tasks in a dashboard, including completion percentage.
- **EmptyDashboardState**: Shown when no dashboards are available.
- **CreateDashboardModal**: Modal form for creating new dashboards.

## Custom Hooks

- **useDashboardStats**: Fetches and calculates task statistics for each dashboard.
- **useCreateDashboard**: Manages form state and submission logic for dashboard creation.

## Design Patterns

1. **Container/Presentational Pattern**: Components are separated into containers (managing logic) and presentational components (handling UI).
2. **Custom Hook Pattern**: Complex logic is extracted into custom hooks for reusability.
3. **Form Extract Pattern**: Form state and validation logic is extracted from form components.

## Data Flow

1. The dashboard page fetches dashboards from the API.
2. The `DashboardList` component receives these dashboards as props.
3. The `useDashboardStats` hook enriches the dashboards with task statistics.
4. Individual `DashboardCard` components render each dashboard.
5. `TaskStatistics` components display the task completion statistics.
6. If no dashboards exist, the `EmptyDashboardState` component is displayed.
7. The `CreateDashboardModal` handles new dashboard creation using the `useCreateDashboard` hook.

## Type Definitions

- **Dashboard**: Base dashboard type from the todo-planner feature.
- **DashboardWithStats**: Extended type that includes task statistics.
- **TaskStats**: Type for task statistics (total, completed, pending).
- **CreateDashboardData**: Type for creating a new dashboard.

## Event Handling

The dashboard components handle the following events:
- Dashboard deletion
- Navigation to dashboard details
- Dashboard creation form submission

## Styling

Components use Tailwind CSS for styling with a black and white theme consistent with the application's design language. 