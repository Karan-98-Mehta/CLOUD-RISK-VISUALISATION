# ☁️ Interactive Cloud Risk Visualization

An interactive React + React Flow application that visualizes cloud infrastructure risks through a collapsible, zoomable graph layout. Nodes represent cloud entities like providers, services, and resources — each colored and styled based on their alert and misconfiguration severity.

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/cloud-risk-visualization.git
cd cloud-risk-visualization
```

### 2. Install Dependencies

npm install, Required dependencies:

- reactflow
- dagre
- tailwindcss
- daisyui
- lucide-react

### 3. Configure Tailwind and DaisyUI

```js
  module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: { extend: {} },
    plugins: [require('daisyui')],
  };
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```


### 🧠 Functionality Overview

✅ Collapsibility (Node Click Behavior)
Each node in the graph can be collapsed or expanded via user interaction:

Clicking a node toggles all its descendant nodes recursively.

This is tracked using a collapsed flag on each node.

Descendants are determined via getAllDescendants() and updated using useNodesState.

A zoom effect is applied:

Collapsing nodes triggers a zoom-in

Expanding triggers a zoom-out

Zoom transitions are handled using React Flow's useReactFlow and setViewport.

-------

✅ Filtering (Top-Level Filter Buttons)
The app supports three filters:

All – Show all nodes (except manually collapsed)

Alerts – Show only nodes with alerts > 0 and their ancestors

Misconfigurations – Show only nodes with misconfigs > 0 and their ancestors

Filter logic:

Nodes are checked against the selected filter condition.

If a node matches, it and all its ancestors are marked as visible.

Any nodes not matching the filter + not already collapsed are hidden.

Filtering state is tracked via React useState and applied dynamically in the render pass.

--------

✅ Layout Logic

The graph layout is calculated using dagre with rankdir: 'LR' (left-to-right).

All node positions are preprocessed before rendering.

Edges use the step type with arrowheads (MarkerType.ArrowClosed) for a clean, directional look.
